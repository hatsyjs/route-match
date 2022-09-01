import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { RouteCaptor } from '../route-captor';
import { routeMatch, RoutePattern } from '../route-match';
import { URLRoute, urlRoute } from '../url';
import { rmatchAny } from './rmatch-any';
import { rmatchDirSep } from './rmatch-dir-sep';

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
      expect(captor).toHaveBeenCalledWith('capture', 1, 'file', expect.anything());
      expect(captor).toHaveBeenCalledTimes(1);
    });
    it('captures directory', () => {
      const match = routeMatch(urlRoute(new URL('http://localhost/dir/')), pattern);

      match?.(captor);
      expect(captor).toHaveBeenCalledWith('capture', 1, 'dir', expect.anything());
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
      expect(captor).toHaveBeenCalledWith('capture', 1, 'dir', expect.anything());
      expect(captor).toHaveBeenCalledWith('capture', 2, 'file', expect.anything());
      expect(captor).toHaveBeenCalledTimes(2);
    });
  });
});
