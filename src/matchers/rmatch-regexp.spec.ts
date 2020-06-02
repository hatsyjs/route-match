import { routeMatch } from '../route-match';
import { urlRoute } from '../url';
import { rmatchAny } from './rmatch-any';
import { rmatchRegExp } from './rmatch-regexp';

describe('rmatchRegExp', () => {

  let capture: jest.Mock;

  beforeEach(() => {
    capture = jest.fn();
  });

  describe('{capture:/regexp/}', () => {
    it('captures entry name', () => {
      const route = urlRoute(new URL('http://localhost/the-test!'));
      const match = routeMatch(route, [rmatchRegExp(/.*test.*/, 'out')]);

      match?.(capture);
      expect(capture).toHaveBeenCalledWith('regexp', 'out', expect.anything(), expect.anything());
      expect(capture).toHaveBeenCalledTimes(1);
      expect([...capture.mock.calls[0][2]]).toEqual(['the-test!']);
    });
    it('does not match non-matching entry name', () => {

      const route = urlRoute(new URL('http://localhost/the-test'));

      expect(routeMatch(route, [rmatchRegExp(/test/)])).toBeNull();
    });
    it('captures the first matching group when the pattern is not global', () => {

      const route = urlRoute(new URL('http://localhost/test-TEST'));
      const match = routeMatch(route, [rmatchRegExp(/(test)-?/i, 'out'), rmatchAny]);

      match?.(capture);
      expect(capture).toHaveBeenCalledWith('regexp', 'out', expect.anything(), expect.anything());
      expect(capture).toHaveBeenCalledTimes(1);
      expect([...capture.mock.calls[0][2]]).toEqual(['test-', 'test']);
    });
  });

  describe('{capture:/regexp/g}', () => {
    it('captures all matching groups', () => {

      const route = urlRoute(new URL('http://localhost/test-TEST'));
      const match = routeMatch(route, [rmatchRegExp(/(test)-?/gi, 'out')]);

      match?.(capture);
      expect(capture).toHaveBeenCalledWith('regexp', 'out', expect.anything(), expect.anything());
      expect(capture).toHaveBeenCalledTimes(2);
      expect([...capture.mock.calls[0][2]]).toEqual(['test-', 'test']);
      expect([...capture.mock.calls[1][2]]).toEqual(['TEST', 'TEST']);
    });
  });

  describe('{/regexp/y}', () => {
    it('matches entry name', () => {

      const route = urlRoute(new URL('http://localhost/the-test!'));
      const pattern = /.*test.*/y;
      const match = routeMatch(route, [rmatchRegExp(pattern)]);

      expect(match).toBeTruthy();
      expect(pattern.lastIndex).toBe(0);
    });
  });
});
