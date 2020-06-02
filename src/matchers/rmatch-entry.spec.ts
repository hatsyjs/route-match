import { routeMatch } from '../route-match';
import { urlRoute } from '../url';
import { rmatchEntry } from './rmatch-entry';

describe('rmatchEntry', () => {
  describe('*', () => {

    const pattern = [rmatchEntry];

    it('does not match empty route', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/')), pattern)).toBeNull();
    });
    it('matches file', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/file')), pattern)).toBeTruthy();
    });
    it('matches dir', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/dir/')), pattern)).toBeTruthy();
    });
    it('does not match too long path', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/dir/file')), pattern)).toBeNull();
    });
  });
});
