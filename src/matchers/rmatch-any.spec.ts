import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { RouteCaptor } from '../route-captor.js';
import { routeMatch, RoutePattern } from '../route-match.js';
import { RouteMatcher } from '../route-matcher.js';
import { URLRoute, urlRoute } from '../url/url-route.js';
import { rmatchAny } from './rmatch-any.js';
import { rmatchDirSep } from './rmatch-dir-sep.js';

describe('rmatchAny', () => {
  let captor: RouteCaptor<URLRoute>;

  beforeEach(() => {
    captor = jest.fn();
  });

  describe('*', () => {
    const pattern: RoutePattern = [rmatchAny];

    it('does not match empty route', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/')), pattern)).toBeNull();
    });
    it('captures file', () => {
      const match = routeMatch(urlRoute(new URL('http://localhost/file')), pattern);

      match?.(captor);
      expect(captor).toHaveBeenCalledWith(
        'capture',
        1,
        'file',
        expect.anything() as unknown as RouteMatcher.Context<URLRoute>,
      );
      expect(captor).toHaveBeenCalledTimes(1);
    });
    it('captures directory', () => {
      const match = routeMatch(urlRoute(new URL('http://localhost/dir/')), pattern);

      match?.(captor);
      expect(captor).toHaveBeenCalledWith(
        'capture',
        1,
        'dir',
        expect.anything() as unknown as RouteMatcher.Context<URLRoute>,
      );
      expect(captor).toHaveBeenCalledTimes(1);
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
    it('captures two entries', () => {
      const match = routeMatch(urlRoute(new URL('http://localhost/dir/file')), pattern);

      match?.(captor);
      expect(captor).toHaveBeenCalledWith(
        'capture',
        1,
        'dir',
        expect.anything() as unknown as RouteMatcher.Context<URLRoute>,
      );
      expect(captor).toHaveBeenCalledWith(
        'capture',
        2,
        'file',
        expect.anything() as unknown as RouteMatcher.Context<URLRoute>,
      );
      expect(captor).toHaveBeenCalledTimes(2);
    });
  });
});
