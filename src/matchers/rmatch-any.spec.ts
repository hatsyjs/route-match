import { pathRouteByURL } from '../path';
import { routeMatch, RoutePattern } from '../route-match';
import { rmatchAny } from './rmatch-any';
import { rmatchDirSep } from './rmatch-dir-sep';

describe('rmatchAny', () => {
  describe('*', () => {

    let pattern: RoutePattern;

    beforeAll(() => {
      pattern = [rmatchAny];
    });

    it('matches empty route', () => {
      expect(routeMatch(pathRouteByURL(new URL('http://localhost/')), pattern)).toEqual({
        spec: [],
        results: {},
      });
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

    let pattern: RoutePattern;

    beforeAll(() => {
      pattern = [rmatchAny, rmatchDirSep, rmatchAny];
    });

    it('does not match single file', () => {
      expect(routeMatch(pathRouteByURL(new URL('http://localhost/file')), pattern)).toBeNull();
    });
    it('matches single directory', () => {
      expect(routeMatch(pathRouteByURL(new URL('http://localhost/dir/')), pattern)).toEqual({
        spec: [],
        results: {},
      });
    });
    it('matches two entries', () => {
      expect(routeMatch(pathRouteByURL(new URL('http://localhost/dir/file')), pattern)).toEqual({
        spec: [],
        results: {},
      });
    });
  });
});
