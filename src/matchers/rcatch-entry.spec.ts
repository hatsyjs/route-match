import { routeMatch } from '../route-match';
import { urlRoute } from '../url';
import { rcatchEntry } from './rcatch-entry';

describe('rcatchEntry', () => {

  let capture: jest.Mock;

  beforeEach(() => {
    capture = jest.fn();
  });

  describe('*', () => {

    const pattern = [rcatchEntry('out')];

    it('does not match empty route', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/')), pattern)).toBeNull();
    });
    it('captures file', () => {

      const match = routeMatch(urlRoute(new URL('http://localhost/file')), pattern);

      match?.(capture);
      expect(capture).toHaveBeenCalledWith('capture', 'out', 'file', expect.anything());
    });
    it('matches dir', () => {

      const match = routeMatch(urlRoute(new URL('http://localhost/dir/')), pattern);

      match?.(capture);
      expect(capture).toHaveBeenCalledWith('capture', 'out', 'dir', expect.anything());
    });
    it('does not match too long path', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/dir/file')), pattern)).toBeNull();
    });
    it('does not match at entry name offset', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/the-file')), pattern, { nameOffset: 4 })).toBeNull();
    });
  });
});
