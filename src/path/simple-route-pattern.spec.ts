import { routeMatch } from '../route-match';
import { urlRoute } from '../url';
import { simpleRoutePattern } from './simple-route-pattern';

describe('simpleRoutePattern', () => {

  let capture: jest.Mock;

  beforeEach(() => {
    capture = jest.fn();
  });

  it('is empty on empty string', () => {
    expect(simpleRoutePattern('')).toEqual([]);
  });

  describe('name/**', () => {
    it('matches any dirs', () => {
      expect(routeMatch(
          urlRoute(new URL('http://localhost/name/some/path')),
          simpleRoutePattern('name/**'),
      )).toBeTruthy();
    });
  });

  describe('name/{out:**}', () => {
    it('captures path', () => {

      const match = routeMatch(
          urlRoute(new URL('http://localhost/name/some/path')),
          simpleRoutePattern('name/{out:**}'),
      );

      expect(match).toBeTruthy();
      match?.(capture);
      expect(capture).toHaveBeenCalledWith('dirs', 'out', 3, expect.anything());
    });
  });

  describe('name/{:**}', () => {
    it('captures nested path', () => {

      const match = routeMatch(
          urlRoute(new URL('http://localhost/name/some/path')),
          simpleRoutePattern('name/{:**}'),
      );

      expect(match).toBeTruthy();
      match?.(capture);
      expect(capture).toHaveBeenCalledWith('dirs', 1, 3, expect.anything());
      expect(capture).toHaveBeenCalledTimes(1);
    });
  });

  describe('*/file', () => {
    it('matches dir', () => {
      expect(routeMatch(
          urlRoute(new URL('http://localhost/dir/file')),
          simpleRoutePattern('*/file'),
      )).toBeTruthy();
    });
  });

  describe('{out}/file', () => {
    it('captures dir', () => {

      const match = routeMatch(
          urlRoute(new URL('http://localhost/dir/file')),
          simpleRoutePattern('{out}/file'),
      );

      expect(match).toBeTruthy();
      match?.(capture);
      expect(capture).toHaveBeenCalledWith('capture', 'out', 'dir', expect.anything());
    });
  });

  describe('{out:wrong}/file', () => {
    it('captures dir', () => {

      const match = routeMatch(
          urlRoute(new URL('http://localhost/dir/file')),
          simpleRoutePattern('{out:wrong}/file'),
      );

      expect(match).toBeTruthy();
      match?.(capture);
      expect(capture).toHaveBeenCalledWith('capture', 'out', 'dir', expect.anything());
    });
  });

  describe('{:wrong}/file', () => {
    it('does not capture dir', () => {

      const match = routeMatch(
          urlRoute(new URL('http://localhost/dir/file')),
          simpleRoutePattern('{:wrong}/file'),
      );

      expect(match).toBeTruthy();
      match?.(capture);
      expect(capture).not.toHaveBeenCalled();
    });
  });

  describe('{}', () => {
    it('does not capture file', () => {

      const match = routeMatch(
          urlRoute(new URL('http://localhost/test')),
          simpleRoutePattern('{}'),
      );

      expect(match).toBeTruthy();
      match?.(capture);
      expect(capture).not.toHaveBeenCalled();
    });
  });

  describe('{)(}', () => {
    it('captures file', () => {

      const match = routeMatch(
          urlRoute(new URL('http://localhost/test')),
          simpleRoutePattern('{)(}'),
      );

      expect(match).toBeTruthy();
      match?.(capture);
      expect(capture).toHaveBeenCalledWith('capture', ')(', 'test', expect.anything());
    });
  });

  describe('/', () => {
    it('matches empty route', () => {

      const match = routeMatch(
          urlRoute(new URL('http://localhost/')),
          simpleRoutePattern('/'),
      );

      expect(match).toBeTruthy();
    });
  });
});
