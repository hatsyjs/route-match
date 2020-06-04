import { routeMatch, RoutePattern } from '../route-match';
import { urlRoute } from '../url';
import { rmatchAny } from './rmatch-any';
import { rmatchDirSep } from './rmatch-dir-sep';

describe('rmatchAny', () => {

  let capture: jest.Mock;

  beforeEach(() => {
    capture = jest.fn();
  });

  describe('*', () => {

    const pattern: RoutePattern = [rmatchAny];

    it('does not match empty route', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/')), pattern)).toBeNull();
    });
    it('captures file', () => {

      const match = routeMatch(urlRoute(new URL('http://localhost/file')), pattern);

      match?.(capture);
      expect(capture).toHaveBeenCalledWith('capture', 1, 'file', expect.anything());
      expect(capture).toHaveBeenCalledTimes(1);
    });
    it('captures directory', () => {

      const match = routeMatch(urlRoute(new URL('http://localhost/dir/')), pattern);

      match?.(capture);
      expect(capture).toHaveBeenCalledWith('capture', 1, 'dir', expect.anything());
      expect(capture).toHaveBeenCalledTimes(1);
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

      match?.(capture);
      expect(capture).toHaveBeenCalledWith('capture', 1, 'dir', expect.anything());
      expect(capture).toHaveBeenCalledWith('capture', 2, 'file', expect.anything());
      expect(capture).toHaveBeenCalledTimes(2);
    });
  });
});
