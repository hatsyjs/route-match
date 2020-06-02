import { routeMatch, RoutePattern } from '../route-match';
import { urlRoute } from '../url';
import { rmatchAny } from './rmatch-any';
import { rmatchDirSep } from './rmatch-dir-sep';

describe('rmatchAny', () => {
  describe('*', () => {

    const pattern: RoutePattern = [rmatchAny];

    it('does not match empty route', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/')), pattern)).toBeNull();
    });
    it('matches file', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/file')), pattern)).toBeTruthy();
    });
    it('matches directory', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/dir/')), pattern)).toBeTruthy();
    });
    it('does not match multiple entries', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/dir/file')), pattern)).toBeNull();
    });
  });

  describe('*/*', () => {

    const pattern = [rmatchAny, rmatchDirSep, rmatchAny];

    it('does not match single file', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/file')), pattern)).toBeNull();
    });
    it('does not match single directory', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/dir/')), pattern)).toBeNull();
    });
    it('matches two entries', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/dir/file')), pattern)).toBeTruthy();
    });
  });
});
