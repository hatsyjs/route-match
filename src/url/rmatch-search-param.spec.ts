import { rmatchName } from '../matchers';
import { routeMatch } from '../route-match';
import { rmatchSearchParam } from './rmatch-search-param';
import { urlRoute } from './url-route';

describe('rmatchSearchParam', () => {
  describe('?param', () => {

    const pattern = [rmatchSearchParam('param')];

    it('matches URL with required parameter without value', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/?param')), pattern)).toBeTruthy();
    });
    it('matches URL with required parameter with value', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/?param=value')), pattern)).toBeTruthy();
    });
    it('does not match URL without required parameter', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/?other=value')), pattern)).toBeNull();
    });
  });

  describe('?param=value', () => {

    const pattern = [rmatchSearchParam('param', 'value')];

    it('does not match matches URL with required parameter without value', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/?param')), pattern)).toBeNull();
    });
    it('matches URL with required parameter with required value', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/?param=value')), pattern)).toBeTruthy();
    });
    it('matches URL if one of required parameter values matches', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/?param=wrong&param=value')), pattern)).toBeTruthy();
    });
    it('does not match URL without required parameter', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/?other=value')), pattern)).toBeNull();
    });
    it('does not match URL if required parameter has wrong value', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/?param=wrong')), pattern)).toBeNull();
    });
  });

  describe('<name>?param=value', () => {

    const pattern = [rmatchName('path'), rmatchSearchParam('param', 'value')];

    it('does not match match URL with required parameter without value', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/path?param')), pattern)).toBeNull();
    });
    it('matches URL with required parameter with required value', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/path?param=value')), pattern)).toBeTruthy();
    });
    it('does not match match URL with wrong path', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/wrong?param=value')), pattern)).toBeNull();
    });
    it('matches URL with if one of required parameter values matches', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/path?param=wrong&param=value')), pattern)).toBeTruthy();
    });
    it('does not match URL without required parameter', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/path?other=value')), pattern)).toBeNull();
    });
    it('does not match URL if required parameter has wrong value', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/path?param=wrong')), pattern)).toBeNull();
    });
  });
});
