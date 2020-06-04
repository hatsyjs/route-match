import { routeMatch } from '../route-match';
import { urlRoute } from '../url';
import { rcaptureEntry } from './rcapture-entry';

describe('rcaptureEntry', () => {

  let capture: jest.Mock;

  beforeEach(() => {
    capture = jest.fn();
  });

  describe('*', () => {

    const pattern = [rcaptureEntry('out')];

    it('does not match empty route', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/')), pattern)).toBeNull();
    });
    it('captures file', () => {

      const match = routeMatch(urlRoute(new URL('http://localhost/file')), pattern);

      match?.(capture);
      expect(capture).toHaveBeenCalledWith('capture', 'out', 'file', expect.anything());
      expect(capture).toHaveBeenCalledTimes(1);
    });
    it('captures dir', () => {

      const match = routeMatch(urlRoute(new URL('http://localhost/dir/')), pattern);

      match?.(capture);
      expect(capture).toHaveBeenCalledWith('capture', 'out', 'dir', expect.anything());
      expect(capture).toHaveBeenCalledTimes(1);
    });
    it('does not match too long path', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/dir/file')), pattern)).toBeNull();
    });
    it('does not match at entry name offset', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/the-file')), pattern, { nameOffset: 4 })).toBeNull();
    });
  });
});
