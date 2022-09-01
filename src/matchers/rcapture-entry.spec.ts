import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { RouteCaptor } from '../route-captor';
import { routeMatch } from '../route-match';
import { URLRoute, urlRoute } from '../url';
import { rcaptureEntry } from './rcapture-entry';

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
      expect(captor).toHaveBeenCalledWith('capture', 'out', 'file', expect.anything());
      expect(captor).toHaveBeenCalledTimes(1);
    });
    it('captures dir', () => {
      const match = routeMatch(urlRoute(new URL('http://localhost/dir/')), pattern);

      match?.(captor);
      expect(captor).toHaveBeenCalledWith('capture', 'out', 'dir', expect.anything());
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
