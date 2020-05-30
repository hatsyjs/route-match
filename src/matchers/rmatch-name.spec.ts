import { routeMatch } from '../route-match';
import { urlRoute } from '../url';
import { rmatchName } from './rmatch-name';

describe('rmatchName', () => {
  describe('<name>', () => {

    const pattern = [rmatchName('test')];

    it('matches file name', () => {

      const route = urlRoute(new URL('http://localhost/test'));

      expect(routeMatch(route, pattern)).toBeTruthy();
    });
    it('matches dir name', () => {

      const route = urlRoute(new URL('http://localhost/test/'));

      expect(routeMatch(route, pattern)).toBeTruthy();
    });
    it('does not match the after offset', () => {

      const route = urlRoute(new URL('http://localhost/the-test/'));

      expect(routeMatch(route, pattern, { nameOffset: 4 })).toBeNull();
    });
    it('does not match wrong name', () => {

      const route = urlRoute(new URL('http://localhost/test!/'));

      expect(routeMatch(route, pattern)).toBeNull();
    });
  });
});
