import { pathRouteByURL } from '../path';
import { routeMatch } from '../route-match';
import { rmatchAny } from './rmatch-any';
import { rmatchRegExp } from './rmatch-regexp';

describe('rmatchRegExp', () => {
  describe('/regexp/', () => {
    it('matches entry name', () => {

      const route = pathRouteByURL(new URL('http://localhost/the-test!'));

      expect(routeMatch(route, [rmatchRegExp(/.*test.*/)])).toEqual({
        spec: [0, 1],
        results: {},
      });
    });
    it('does not match non-matching entry name', () => {

      const route = pathRouteByURL(new URL('http://localhost/the-test'));

      expect(routeMatch(route, [rmatchRegExp(/test/)])).toBeNull();
    });
    it('captures the first matching group when the pattern is not global', () => {

      const route = pathRouteByURL(new URL('http://localhost/test-TEST'));

      expect(routeMatch(route, [rmatchRegExp(/(test)[-]/i, 'group1', 'group2'), rmatchAny])).toEqual({
        spec: [0, 1],
        results: {
          group1: 'test',
        },
      });
    });
  });

  describe('/regexp/g', () => {
    it('captures all matching groups', () => {

      const route = pathRouteByURL(new URL('http://localhost/test-TEST'));

      expect(routeMatch(route, [rmatchRegExp(/(test)[-]*/gi, 'group1', 'group2', 'group3')])).toEqual({
        spec: [0, 2],
        results: {
          group1: 'test',
          group2: 'TEST',
        },
      });
    });
  });

  describe('/regexp/y', () => {
    it('matches entry name', () => {

      const route = pathRouteByURL(new URL('http://localhost/the-test!'));
      const pattern = /.*test.*/y;

      expect(routeMatch(route, [rmatchRegExp(pattern)])).toEqual({
        spec: [0, 1],
        results: {},
      });
      expect(pattern.lastIndex).toBe(0);
    });
  });
});
