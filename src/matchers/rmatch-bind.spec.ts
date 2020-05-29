import { pathRouteByURL } from '../path';
import { routeMatch, RoutePattern } from '../route-match';
import { urlRoute } from '../url';
import { rmatchAny } from './rmatch-any';
import { rmatchBind } from './rmatch-bind';
import { rmatchDirSep } from './rmatch-dir-sep';
import { rmatchString } from './rmatch-string';

describe('rmatchBind', () => {
  describe('{name}', () => {

    const pattern: RoutePattern = [rmatchBind('out')];

    it('does not match empty route', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/')), pattern)).toBeNull();
    });
    it('matches file', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/file')), pattern)).toEqual({
        spec: [],
        results: { out: 'file' },
      });
    });
    it('matches directory', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/dir/')), pattern)).toEqual({
        spec: [],
        results: { out: 'dir' },
      });
    });
    it('does not match multiple entries', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/dir/file')), pattern)).toBeNull();
    });
  });

  describe('{name}/*', () => {

    const pattern = [rmatchBind('out'), rmatchDirSep, rmatchAny];

    it('matches two entries', () => {
      expect(routeMatch(pathRouteByURL(new URL('http://localhost/dir/file')), pattern)).toEqual({
        spec: [],
        results: { out: 'dir' },
      });
    });
  });

  describe('*/{name}', () => {

    const pattern = [rmatchAny, rmatchDirSep, rmatchBind('out')];

    it('matches two entries', () => {
      expect(routeMatch(pathRouteByURL(new URL('http://localhost/dir/file')), pattern)).toEqual({
        spec: [],
        results: { out: 'file' },
      });
    });
  });

  describe('<string>{name}', () => {

    const pattern = [rmatchString('page-'), rmatchBind('page')];

    it('matches file', () => {
      expect(routeMatch(pathRouteByURL(new URL('http://localhost/page-1')), pattern)).toEqual({
        spec: [0, 1],
        results: { page: '1' },
      });
    });
    it('does not match file with wrong prefix', () => {
      expect(routeMatch(pathRouteByURL(new URL('http://localhost/page1')), pattern)).toBeNull();
    });
  });

  describe('{name}<string>', () => {

    const pattern = [rmatchBind('file'), rmatchString('.html')];

    it('matches file', () => {
      expect(routeMatch(pathRouteByURL(new URL('http://localhost/index.html')), pattern)).toEqual({
        spec: [0, 1],
        results: { file: 'index' },
      });
    });
    it('does not match file with wrong suffix', () => {
      expect(routeMatch(pathRouteByURL(new URL('http://localhost/index.htm')), pattern)).toBeNull();
    });
  });
});
