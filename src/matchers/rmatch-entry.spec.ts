import { routeMatch } from '../route-match';
import { urlRoute } from '../url';
import { rmatchEntry } from './rmatch-entry';

describe('rmatchEntry', () => {

  let capture: jest.Mock;

  beforeEach(() => {
    capture = jest.fn();
  });

  describe('*', () => {

    const pattern = [rmatchEntry];

    it('does not match empty route', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/')), pattern)).toBeNull();
    });
    it('captures file', () => {

      const match = routeMatch(urlRoute(new URL('http://localhost/file')), pattern);

      match?.(capture);
      expect(capture).toHaveBeenCalledWith('capture', 1, 'file', expect.anything());
    });
    it('captures dir', () => {

      const match = routeMatch(urlRoute(new URL('http://localhost/dir/')), pattern);

      match?.(capture);
      expect(capture).toHaveBeenCalledWith('capture', 1, 'dir', expect.anything());
      expect(capture).toHaveBeenCalledTimes(1);
    });
    it('does not match too long path', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/dir/file')), pattern)).toBeNull();
    });
  });
});
