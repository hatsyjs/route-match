import { pathRouteByURL } from '../path';
import { routeMatch, RoutePattern } from '../route-match';
import { urlRoute } from '../url';
import { rmatchAny } from './rmatch-any';
import { rmatchCapture } from './rmatch-capture';
import { rmatchDirSep } from './rmatch-dir-sep';
import { rmatchString } from './rmatch-string';

describe('rmatchCapture', () => {

  let cb: jest.Mock;

  beforeEach(() => {
    cb = jest.fn();
  });

  describe('{capture}', () => {

    let pattern: RoutePattern;

    beforeEach(() => {
      pattern = [rmatchCapture(cb)];
    });

    it('does not match empty route', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/')), pattern)).toBeNull();
    });
    it('matches file', () => {

      const match = routeMatch(urlRoute(new URL('http://localhost/file')), pattern);

      match?.callback();
      expect(cb).toHaveBeenCalledWith('file', expect.anything());
    });
    it('matches directory', () => {

      const match = routeMatch(urlRoute(new URL('http://localhost/dir/')), pattern);

      match?.callback();
      expect(cb).toHaveBeenCalledWith('dir', expect.anything());
    });
    it('does not match multiple entries', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/dir/file')), pattern)).toBeNull();
    });
  });

  describe('{capture}/*', () => {

    let pattern: RoutePattern;

    beforeEach(() => {
      pattern = [rmatchCapture(cb), rmatchDirSep, rmatchAny];
    });

    it('matches two entries', () => {

      const match = routeMatch(pathRouteByURL(new URL('http://localhost/dir/file')), pattern);

      match?.callback();
      expect(cb).toHaveBeenCalledWith('dir', expect.anything());
    });
  });

  describe('*/{capture}', () => {

    let pattern: RoutePattern;

    beforeEach(() => {
      pattern = [rmatchAny, rmatchDirSep, rmatchCapture(cb)];
    });

    it('matches two entries', () => {

      const match = routeMatch(pathRouteByURL(new URL('http://localhost/dir/file')), pattern);

      match?.callback();
      expect(cb).toHaveBeenCalledWith('file', expect.anything());
    });
  });

  describe('<string>{capture}', () => {

    let pattern: RoutePattern;

    beforeEach(() => {
      pattern = [rmatchString('page-'), rmatchCapture(cb)];
    });

    it('matches file', () => {

      const match = routeMatch(pathRouteByURL(new URL('http://localhost/page-1')), pattern);

      match?.callback();
      expect(cb).toHaveBeenCalledWith('1', expect.anything());
    });
    it('does not match file with wrong prefix', () => {
      expect(routeMatch(pathRouteByURL(new URL('http://localhost/page1')), pattern)).toBeNull();
    });
  });

  describe('{capture}<string>', () => {

    let pattern: RoutePattern;

    beforeEach(() => {
      pattern = [rmatchCapture(cb), rmatchString('.html')];
    });

    it('matches file', () => {

      const match = routeMatch(pathRouteByURL(new URL('http://localhost/index.html')), pattern);

      match?.callback();
      expect(cb).toHaveBeenCalledWith('index', expect.anything());
    });
    it('does not match file with wrong suffix', () => {
      expect(routeMatch(pathRouteByURL(new URL('http://localhost/index.htm')), pattern)).toBeNull();
    });
  });
});
