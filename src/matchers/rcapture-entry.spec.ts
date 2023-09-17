import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { RouteCaptor } from '../route-captor.js';
import { routeMatch } from '../route-match.js';
import { RouteMatcher } from '../route-matcher.js';
import { rcaptureEntry } from './rcapture-entry.js';
import { URLRoute, urlRoute } from '../url/url-route.js';

describe('rcaptureEntry', () => {
  let captor: RouteCaptor<URLRoute>;

  beforeEach(() => {
    captor = jest.fn();
  });

  describe('*', () => {
    const pattern = [rcaptureEntry('out')];

    it('does not match empty route', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/')), pattern)).toBeNull();
    });
    it('captures file', () => {
      const match = routeMatch(urlRoute(new URL('http://localhost/file')), pattern);

      match?.(captor);
      expect(captor).toHaveBeenCalledWith(
        'capture',
        'out',
        'file',
        expect.anything() as unknown as RouteMatcher.Context<URLRoute>,
      );
      expect(captor).toHaveBeenCalledTimes(1);
    });
    it('captures dir', () => {
      const match = routeMatch(urlRoute(new URL('http://localhost/dir/')), pattern);

      match?.(captor);
      expect(captor).toHaveBeenCalledWith(
        'capture',
        'out',
        'dir',
        expect.anything() as unknown as RouteMatcher.Context<URLRoute>,
      );
      expect(captor).toHaveBeenCalledTimes(1);
    });
    it('does not match too long path', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/dir/file')), pattern)).toBeNull();
    });
    it('does not match at entry name offset', () => {
      expect(
        routeMatch(urlRoute(new URL('http://localhost/the-file')), pattern, { nameOffset: 4 }),
      ).toBeNull();
    });
  });
});
