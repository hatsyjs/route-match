import { describe, expect, it } from '@jest/globals';
import { routeMatch } from '../route-match.js';
import { urlRoute } from '../url/url-route.js';
import { rmatchName } from './rmatch-name.js';

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
