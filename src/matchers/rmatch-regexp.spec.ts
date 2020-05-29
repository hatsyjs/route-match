import { pathRouteByURL } from '../path';
import { routeMatch } from '../route-match';
import { rmatchAny } from './rmatch-any';
import { rmatchRegExp } from './rmatch-regexp';

describe('rmatchRegExp', () => {

  let cb: jest.Mock;

  beforeEach(() => {
    cb = jest.fn();
  });

  describe('/regexp/', () => {
    it('matches entry name', () => {

      const route = pathRouteByURL(new URL('http://localhost/the-test!'));
      const match = routeMatch(route, [rmatchRegExp(/.*test.*/, cb)]);

      expect(match).toEqual({
        spec: [0, 1],
        callback: expect.any(Function),
      });
      match?.callback();
      expect(cb).toHaveBeenCalledTimes(1);
      expect([...cb.mock.calls[0][0]]).toEqual(['the-test!']);
    });
    it('does not match non-matching entry name', () => {

      const route = pathRouteByURL(new URL('http://localhost/the-test'));

      expect(routeMatch(route, [rmatchRegExp(/test/)])).toBeNull();
    });
    it('captures the first matching group when the pattern is not global', () => {

      const route = pathRouteByURL(new URL('http://localhost/test-TEST'));
      const match = routeMatch(route, [rmatchRegExp(/(test)-?/i, cb), rmatchAny]);

      expect(match).toEqual({
        spec: [0, 1],
        callback: expect.any(Function),
      });
      match?.callback();
      expect(cb).toHaveBeenCalledTimes(1);
      expect([...cb.mock.calls[0][0]]).toEqual(['test-', 'test']);
    });
  });

  describe('/regexp/g', () => {
    it('captures all matching groups', () => {

      const route = pathRouteByURL(new URL('http://localhost/test-TEST'));
      const match = routeMatch(route, [rmatchRegExp(/(test)-?/gi, cb)]);

      expect(match).toEqual({
        spec: [0, 2],
        callback: expect.any(Function),
      });
      match?.callback();
      expect(cb).toHaveBeenCalledTimes(2);
      expect([...cb.mock.calls[0][0]]).toEqual(['test-', 'test']);
      expect([...cb.mock.calls[1][0]]).toEqual(['TEST', 'TEST']);
    });
  });

  describe('/regexp/y', () => {
    it('matches entry name', () => {

      const route = pathRouteByURL(new URL('http://localhost/the-test!'));
      const pattern = /.*test.*/y;
      const match = routeMatch(route, [rmatchRegExp(pattern)]);

      expect(match).toEqual({
        spec: [0, 1],
        callback: expect.any(Function),
      });
      expect(pattern.lastIndex).toBe(0);
    });
  });
});
