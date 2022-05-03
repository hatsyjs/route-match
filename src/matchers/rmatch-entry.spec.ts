import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { RouteCaptor } from '../route-captor';
import { routeMatch } from '../route-match';
import { URLRoute, urlRoute } from '../url';
import { rmatchEntry } from './rmatch-entry';

describe('rmatchEntry', () => {

  let captor: RouteCaptor<URLRoute>;

  beforeEach(() => {
    captor = jest.fn();
  });

  describe('*', () => {

    const pattern = [rmatchEntry];

    it('does not match empty route', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/')), pattern)).toBeNull();
    });
    it('captures file', () => {

      const match = routeMatch(urlRoute(new URL('http://localhost/file')), pattern);

      match?.(captor);
      expect(captor).toHaveBeenCalledWith('capture', 1, 'file', expect.anything());
    });
    it('captures dir', () => {

      const match = routeMatch(urlRoute(new URL('http://localhost/dir/')), pattern);

      match?.(captor);
      expect(captor).toHaveBeenCalledWith('capture', 1, 'dir', expect.anything());
      expect(captor).toHaveBeenCalledTimes(1);
    });
    it('does not match too long path', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/dir/file')), pattern)).toBeNull();
    });
  });
});
