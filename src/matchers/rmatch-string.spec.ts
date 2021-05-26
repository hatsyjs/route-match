import { describe, expect, it } from '@jest/globals';
import { routeMatch, RoutePattern } from '../route-match';
import { urlRoute } from '../url';
import { rmatchAny } from './rmatch-any';
import { rmatchString } from './rmatch-string';

describe('rmatchString', () => {
  describe('<string>', () => {

    const pattern: RoutePattern = [rmatchString('test')];

    it('matches file name', () => {

      const route = urlRoute(new URL('http://localhost/test'));

      expect(routeMatch(route, pattern)).toBeTruthy();
    });
    it('matches dir name', () => {

      const route = urlRoute(new URL('http://localhost/test/'));

      expect(routeMatch(route, pattern)).toBeTruthy();
    });
    it('matches string at offset', () => {

      const route = urlRoute(new URL('http://localhost/the-test/'));

      expect(routeMatch(route, pattern, { nameOffset: 4 })).toBeTruthy();
    });
    it('does not match name with suffix', () => {

      const route = urlRoute(new URL('http://localhost/the-test!/'));

      expect(routeMatch(route, pattern, { nameOffset: 4 })).toBeNull();
    });
  });

  describe('<string>*', () => {
    it('matches prefix with suffix', () => {

      const route = urlRoute(new URL('http://localhost/test!/'));

      expect(routeMatch(route, [rmatchString('test'), rmatchAny])).toBeTruthy();
    });
  });

  describe('<string1><string2>', () => {
    it('matches subsequent strings', () => {

      const route = urlRoute(new URL('http://localhost/test!/'));

      expect(routeMatch(route, [rmatchString('test'), rmatchString('!')])).toBeTruthy();
    });
  });

  describe('*<string>', () => {

    const pattern = [rmatchAny, rmatchString('test')];

    it('matches string', () => {

      const route = urlRoute(new URL('http://localhost/test'));

      expect(routeMatch(route, pattern)).toBeTruthy();
    });
    it('matches string with prefix', () => {

      const route = urlRoute(new URL('http://localhost/the-test/'));

      expect(routeMatch(route, pattern)).toBeTruthy();
    });
    it('does not match wrong string', () => {

      const route = urlRoute(new URL('http://localhost/wrong'));

      expect(routeMatch(route, pattern)).toBeNull();
    });
  });

  describe('*<string1><string2>', () => {

    const pattern = [rmatchAny, rmatchString('test'), rmatchString('!')];

    it('matches strings', () => {

      const route = urlRoute(new URL('http://localhost/test!'));

      expect(routeMatch(route, pattern)).toBeTruthy();
    });
    it('matches strings after prefix', () => {

      const route = urlRoute(new URL('http://localhost/the-test!/'));

      expect(routeMatch(route, pattern)).toBeTruthy();
    });
    it('does not match wrong first string', () => {

      const route = urlRoute(new URL('http://localhost/other!'));

      expect(routeMatch(route, pattern)).toBeNull();
    });
    it('does not match wrong second string', () => {

      const route = urlRoute(new URL('http://localhost/test?'));

      expect(routeMatch(route, pattern)).toBeNull();
    });
  });
});
