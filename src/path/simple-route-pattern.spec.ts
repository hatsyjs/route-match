import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { RouteCaptor } from '../route-captor.js';
import { routeMatch } from '../route-match.js';
import { RouteMatcher } from '../route-matcher.js';
import { URLRoute, urlRoute } from '../url/url-route.js';
import { simpleRoutePattern } from './simple-route-pattern.js';

describe('simpleRoutePattern', () => {
  let captor: RouteCaptor<URLRoute>;

  beforeEach(() => {
    captor = jest.fn();
  });

  it('is empty on empty string', () => {
    expect(simpleRoutePattern('')).toEqual([]);
  });

  describe('name/**', () => {
    it('matches any dirs', () => {
      expect(
        routeMatch(
          urlRoute(new URL('http://localhost/name/some/path')),
          simpleRoutePattern('name/**'),
        ),
      ).toBeTruthy();
    });
  });

  describe('name/{out:**}', () => {
    it('captures path', () => {
      const match = routeMatch(
        urlRoute(new URL('http://localhost/name/some/path')),
        simpleRoutePattern('name/{out:**}'),
      );

      expect(match).toBeTruthy();
      match?.(captor);
      expect(captor).toHaveBeenCalledWith(
        'dirs',
        'out',
        3,
        expect.anything() as unknown as RouteMatcher.Context<URLRoute>,
      );
    });
  });

  describe('name/{:**}', () => {
    it('captures nested path', () => {
      const match = routeMatch(
        urlRoute(new URL('http://localhost/name/some/path')),
        simpleRoutePattern('name/{:**}'),
      );

      expect(match).toBeTruthy();
      match?.(captor);
      expect(captor).toHaveBeenCalledWith(
        'dirs',
        1,
        3,
        expect.anything() as unknown as RouteMatcher.Context<URLRoute>,
      );
      expect(captor).toHaveBeenCalledTimes(1);
    });
  });

  describe('*/file', () => {
    it('matches dir', () => {
      expect(
        routeMatch(urlRoute(new URL('http://localhost/dir/file')), simpleRoutePattern('*/file')),
      ).toBeTruthy();
    });
  });

  describe('{out}/file', () => {
    it('captures dir', () => {
      const match = routeMatch(
        urlRoute(new URL('http://localhost/dir/file')),
        simpleRoutePattern('{out}/file'),
      );

      expect(match).toBeTruthy();
      match?.(captor);
      expect(captor).toHaveBeenCalledWith(
        'capture',
        'out',
        'dir',
        expect.anything() as unknown as RouteMatcher.Context<URLRoute>,
      );
    });
  });

  describe('{out:wrong}/file', () => {
    it('captures dir', () => {
      const match = routeMatch(
        urlRoute(new URL('http://localhost/dir/file')),
        simpleRoutePattern('{out:wrong}/file'),
      );

      expect(match).toBeTruthy();
      match?.(captor);
      expect(captor).toHaveBeenCalledWith(
        'capture',
        'out',
        'dir',
        expect.anything() as unknown as RouteMatcher.Context<URLRoute>,
      );
    });
  });

  describe('{:wrong}/file', () => {
    it('captures dir anonymously', () => {
      const match = routeMatch(
        urlRoute(new URL('http://localhost/dir/file')),
        simpleRoutePattern('{:wrong}/file'),
      );

      expect(match).toBeTruthy();
      match?.(captor);
      expect(captor).toHaveBeenCalledWith(
        'capture',
        1,
        'dir',
        expect.anything() as unknown as RouteMatcher.Context<URLRoute>,
      );
      expect(captor).toHaveBeenCalledTimes(1);
    });
  });

  describe('{}', () => {
    it('captures file', () => {
      const match = routeMatch(
        urlRoute(new URL('http://localhost/test')),
        simpleRoutePattern('{}'),
      );

      match?.(captor);
      expect(captor).toHaveBeenCalledWith(
        'capture',
        1,
        'test',
        expect.anything() as unknown as RouteMatcher.Context<URLRoute>,
      );
      expect(captor).toHaveBeenCalledTimes(1);
    });
  });

  describe('{)(}', () => {
    it('captures file', () => {
      const match = routeMatch(
        urlRoute(new URL('http://localhost/test')),
        simpleRoutePattern('{)(}'),
      );

      expect(match).toBeTruthy();
      match?.(captor);
      expect(captor).toHaveBeenCalledWith(
        'capture',
        ')(',
        'test',
        expect.anything() as unknown as RouteMatcher.Context<URLRoute>,
      );
    });
  });

  describe('/', () => {
    it('matches empty route', () => {
      const match = routeMatch(urlRoute(new URL('http://localhost/')), simpleRoutePattern('/'));

      expect(match).toBeTruthy();
    });
  });
});
