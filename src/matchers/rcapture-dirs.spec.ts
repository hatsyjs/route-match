import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { RouteCaptor } from '../route-captor.js';
import { routeMatch } from '../route-match.js';
import { RouteMatcher } from '../route-matcher.js';
import { rcaptureDirs } from './rcapture-dirs.js';
import { rmatchDirSep } from './rmatch-dir-sep.js';
import { rmatchName } from './rmatch-name.js';
import { URLRoute, urlRoute } from '../url/url-route.js';

describe('rcaptureDirs', () => {
  let captor: RouteCaptor<URLRoute>;

  beforeEach(() => {
    captor = jest.fn();
  });

  describe('{capture:**}', () => {
    const pattern = [rcaptureDirs('out')];

    it('does not capture empty route', () => {
      const match = routeMatch(urlRoute(new URL('http://localhost')), pattern);

      expect(match).toBeTruthy();
      match?.(captor);
      expect(captor).not.toHaveBeenCalled();
    });
    it('captures file', () => {
      routeMatch(urlRoute(new URL('http://localhost/file.html')), pattern)?.(captor);
      expect(captor).toHaveBeenCalledWith(
        'dirs',
        'out',
        1,
        expect.anything() as unknown as RouteMatcher.Context<URLRoute>,
      );
      expect(captor).toHaveBeenCalledTimes(1);
    });
    it('captures any route', () => {
      routeMatch(urlRoute(new URL('http://localhost/path/to/file.html')), pattern)?.(captor);
      expect(captor).toHaveBeenCalledWith(
        'dirs',
        'out',
        3,
        expect.anything() as unknown as RouteMatcher.Context<URLRoute>,
      );
      expect(captor).toHaveBeenCalledTimes(1);
    });
  });

  describe('{capture:**}<name>', () => {
    const pattern = [rcaptureDirs('out'), rmatchName('test')];

    it('does not capture named file', () => {
      const match = routeMatch(urlRoute(new URL('http://localhost/test')), pattern);

      expect(match).toBeTruthy();
      match?.(captor);
      expect(captor).not.toHaveBeenCalled();
    });
    it('does not capture named dir', () => {
      const match = routeMatch(urlRoute(new URL('http://localhost/test/')), pattern);

      expect(match).toBeTruthy();
      match?.(captor);
      expect(captor).not.toHaveBeenCalled();
    });
    it('captures nested file', () => {
      routeMatch(urlRoute(new URL('http://localhost/dir/test')), pattern)?.(captor);
      expect(captor).toHaveBeenCalledWith(
        'dirs',
        'out',
        1,
        expect.anything() as unknown as RouteMatcher.Context<URLRoute>,
      );
      expect(captor).toHaveBeenCalledTimes(1);
    });
    it('captures deeply nested dir', () => {
      routeMatch(urlRoute(new URL('http://localhost/path/to/deep/test/')), pattern)?.(captor);
      expect(captor).toHaveBeenCalledWith(
        'dirs',
        'out',
        3,
        expect.anything() as unknown as RouteMatcher.Context<URLRoute>,
      );
      expect(captor).toHaveBeenCalledTimes(1);
    });
  });

  describe('{capture:**}/<name>', () => {
    const pattern = [rcaptureDirs('out'), rmatchDirSep, rmatchName('test')];

    it('does not capture named file', () => {
      const match = routeMatch(urlRoute(new URL('http://localhost/test')), pattern);

      expect(match).toBeTruthy();
      match?.(captor);
      expect(captor).not.toHaveBeenCalled();
    });
    it('does not capture named dir', () => {
      const match = routeMatch(urlRoute(new URL('http://localhost/test/')), pattern);

      expect(match).toBeTruthy();
      match?.(captor);
      expect(captor).not.toHaveBeenCalled();
    });
    it('captures nested file', () => {
      routeMatch(urlRoute(new URL('http://localhost/dir/test')), pattern)?.(captor);
      expect(captor).toHaveBeenCalledWith(
        'dirs',
        'out',
        1,
        expect.anything() as unknown as RouteMatcher.Context<URLRoute>,
      );
      expect(captor).toHaveBeenCalledTimes(1);
    });
    it('captures deeply nested dir', () => {
      routeMatch(urlRoute(new URL('http://localhost/path/to/deep/test/')), pattern)?.(captor);
      expect(captor).toHaveBeenCalledWith(
        'dirs',
        'out',
        3,
        expect.anything() as unknown as RouteMatcher.Context<URLRoute>,
      );
      expect(captor).toHaveBeenCalledTimes(1);
    });
  });

  describe('{capture:/**}', () => {
    const pattern = [rmatchName('test'), rmatchDirSep, rcaptureDirs('out')];

    it('does not capture dir itself', () => {
      const match = routeMatch(urlRoute(new URL('http://localhost/test/')), pattern);

      expect(match).toBeTruthy();
      match?.(captor);
      expect(captor).not.toHaveBeenCalled();
    });
    it('captures nested file', () => {
      routeMatch(urlRoute(new URL('http://localhost/test/file')), pattern)?.(captor);
      expect(captor).toHaveBeenCalledWith(
        'dirs',
        'out',
        2,
        expect.anything() as unknown as RouteMatcher.Context<URLRoute>,
      );
      expect(captor).toHaveBeenCalledTimes(1);
    });
    it('captures nested dir', () => {
      routeMatch(urlRoute(new URL('http://localhost/test/dir/')), pattern)?.(captor);
      expect(captor).toHaveBeenCalledWith(
        'dirs',
        'out',
        2,
        expect.anything() as unknown as RouteMatcher.Context<URLRoute>,
      );
      expect(captor).toHaveBeenCalledTimes(1);
    });
  });
});
