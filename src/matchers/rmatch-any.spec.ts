import { pathRouteByURL } from '../path';
import { routeMatch, RoutePattern } from '../route-match';
import { rmatchAny } from './rmatch-any';
import { rmatchDirSep } from './rmatch-dir-sep';

describe('rmatchAny', () => {
  describe('*', () => {

    const pattern: RoutePattern = [rmatchAny];

    it('does not match empty route', () => {
      expect(routeMatch(pathRouteByURL(new URL('http://localhost/')), pattern)).toBeNull();
    });
    it('matches file', () => {
      expect(routeMatch(pathRouteByURL(new URL('http://localhost/file')), pattern)).toEqual({
        spec: [],
        results: {},
      });
    });
    it('matches directory', () => {
      expect(routeMatch(pathRouteByURL(new URL('http://localhost/dir/')), pattern)).toEqual({
        spec: [],
        results: {},
      });
    });
    it('does not match multiple entries', () => {
      expect(routeMatch(pathRouteByURL(new URL('http://localhost/dir/file')), pattern)).toBeNull();
    });
  });

  describe('*/*', () => {

    const pattern = [rmatchAny, rmatchDirSep, rmatchAny];

    it('does not match single file', () => {
      expect(routeMatch(pathRouteByURL(new URL('http://localhost/file')), pattern)).toBeNull();
    });
    it('does not match single directory', () => {
      expect(routeMatch(pathRouteByURL(new URL('http://localhost/dir/')), pattern)).toBeNull();
    });
    it('matches two entries', () => {
      expect(routeMatch(pathRouteByURL(new URL('http://localhost/dir/file')), pattern)).toEqual({
        spec: [],
        results: {},
      });
    });
  });
});
