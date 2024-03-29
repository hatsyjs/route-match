import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { RouteCaptor } from '../route-captor.js';
import { routeMatch } from '../route-match.js';
import { RouteMatcher } from '../route-matcher.js';
import { MatrixRoute, matrixRoute } from './matrix-route.js';
import { matrixRoutePattern } from './matrix-route-pattern.js';

describe('matrixRoutePattern', () => {
  let captor: RouteCaptor<MatrixRoute>;

  beforeEach(() => {
    captor = jest.fn();
  });

  describe('*;attr/file', () => {
    const pattern = matrixRoutePattern('*;attr/file');

    it('captures dir', () => {
      const match = routeMatch(
        matrixRoute(new URL('http://localhost/dir;attr=some/file')),
        pattern,
      );

      match?.(captor);
      expect(captor).toHaveBeenCalledWith(
        'capture',
        1,
        'dir',
        expect.anything() as unknown as RouteMatcher.Context<MatrixRoute>,
      );
      expect(captor).toHaveBeenCalledTimes(1);
    });
    it('does not match file attributes', () => {
      expect(
        routeMatch(matrixRoute(new URL('http://localhost/dir/file;attr')), pattern),
      ).toBeNull();
    });
  });

  describe('*;attr=value/file', () => {
    const pattern = matrixRoutePattern('*;attr=value/file');

    it('captures dir', () => {
      const match = routeMatch(
        matrixRoute(new URL('http://localhost/dir;attr=other;attr=value/file')),
        pattern,
      );

      match?.(captor);
      expect(captor).toHaveBeenCalledWith(
        'capture',
        1,
        'dir',
        expect.anything() as unknown as RouteMatcher.Context<MatrixRoute>,
      );
      expect(captor).toHaveBeenCalledTimes(1);
    });
    it('does not match file attributes', () => {
      expect(
        routeMatch(matrixRoute(new URL('http://localhost/dir/file;attr=value')), pattern),
      ).toBeNull();
    });
  });
});
