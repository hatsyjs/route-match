import { routeMatch } from '../route-match';
import { urlRoute } from '../url';
import { rmatchAnyEntry } from './rmatch-any-entry';

describe('rmatchAnyEntry', () => {
  describe('*', () => {

    const pattern = [rmatchAnyEntry];

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
