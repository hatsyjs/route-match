import { routeMatch } from '../route-match';
import { urlRoute } from '../url';
import { rcatch } from './rcatch';
import { rcatchRegExp } from './rcatch-reg-exp';
import { rmatchAny } from './rmatch-any';

describe('rcatchRegExp', () => {

  let capture: jest.Mock;

  beforeEach(() => {
    capture = jest.fn();
  });

  describe('{capture(regexp)}', () => {
    it('captures entry name', () => {

      const route = urlRoute(new URL('http://localhost/the-test!'));
      const match = routeMatch(route, [rcatchRegExp(/.*test.*/, 'out')]);

      match?.(capture);
      expect(capture).toHaveBeenCalledWith('regexp', 'out', expect.anything(), expect.anything());
      expect(capture).toHaveBeenCalledTimes(1);
      expect([...capture.mock.calls[0][2]]).toEqual(['the-test!']);
    });
    it('does not match non-matching entry name', () => {

      const route = urlRoute(new URL('http://localhost/test!'));

      expect(routeMatch(route, [rcatchRegExp(/test$/)])).toBeNull();
    });
    it('captures the first matching group when the pattern is not global', () => {

      const route = urlRoute(new URL('http://localhost/test-TEST'));
      const match = routeMatch(route, [rcatchRegExp(/(test)/i, 'out'), rmatchAny]);

      match?.(capture);
      expect(capture).toHaveBeenCalledWith('regexp', 'out', expect.anything(), expect.anything());
      expect(capture).toHaveBeenCalledTimes(1);
      expect([...capture.mock.calls[0][2]]).toEqual(['test', 'test']);
    });
  });

  describe('{capture1}{capture2(regexp)}', () => {
    it('captures both captures', () => {

      const route = urlRoute(new URL('http://localhost/the-test!'));
      const pattern = [rcatch('prefix'), rcatchRegExp(/test.*/, 'out')];
      let match = routeMatch(route, pattern);

      match?.(capture);
      expect(capture).toHaveBeenCalledWith('capture', 'prefix', 'the-', expect.anything());
      expect(capture).toHaveBeenCalledWith('regexp', 'out', expect.anything(), expect.anything());
      expect(capture).toHaveBeenCalledTimes(2);
      expect([...capture.mock.calls[1][2]]).toEqual(['test!']);

      // Test again with cached search pattern
      capture.mockClear();
      match = routeMatch(route, pattern);
      match?.(capture);
      expect(capture).toHaveBeenCalledWith('capture', 'prefix', 'the-', expect.anything());
      expect(capture).toHaveBeenCalledWith('regexp', 'out', expect.anything(), expect.anything());
      expect(capture).toHaveBeenCalledTimes(2);
      expect([...capture.mock.calls[1][2]]).toEqual(['test!']);
    });
    it('captures only regexp when prefix is missing', () => {

      const route = urlRoute(new URL('http://localhost/test!'));
      const match = routeMatch(route, [rcatch('prefix'), rcatchRegExp(/test.*/, 'out')]);

      match?.(capture);
      expect(capture).toHaveBeenCalledWith('regexp', 'out', expect.anything(), expect.anything());
      expect(capture).toHaveBeenCalledTimes(1);
      expect([...capture.mock.calls[0][2]]).toEqual(['test!']);
    });
    it('does not match non-matching entry name', () => {

      const route = urlRoute(new URL('http://localhost/the-test!'));

      expect(routeMatch(route, [rcatch('prefix'), rcatchRegExp(/test$/)])).toBeNull();
    });
  });

  describe('{capture(regexp)g}', () => {
    it('captures all matching groups', () => {

      const route = urlRoute(new URL('http://localhost/test-TEST'));
      const match = routeMatch(route, [rcatchRegExp(/(test)-?/gi, 'out')]);

      match?.(capture);
      expect(capture).toHaveBeenCalledWith('regexp', 'out', expect.anything(), expect.anything());
      expect(capture).toHaveBeenCalledTimes(2);
      expect([...capture.mock.calls[0][2]]).toEqual(['test-', 'test']);
      expect([...capture.mock.calls[1][2]]).toEqual(['TEST', 'TEST']);
    });
  });

  describe('*{capture(regexp)g}', () => {
    it('captures all matching groups', () => {

      const route = urlRoute(new URL('http://localhost/prefix-test-TEST'));
      const match = routeMatch(route, [rmatchAny, rcatchRegExp(/(test)-?/gi, 'out')]);

      match?.(capture);
      expect(capture).toHaveBeenCalledWith('regexp', 'out', expect.anything(), expect.anything());
      expect(capture).toHaveBeenCalledTimes(2);
      expect([...capture.mock.calls[0][2]]).toEqual(['test-', 'test']);
      expect([...capture.mock.calls[1][2]]).toEqual(['TEST', 'TEST']);
    });
  });

  describe('{(regexp)y}', () => {
    it('matches entry name', () => {

      const route = urlRoute(new URL('http://localhost/the-test!'));
      const pattern = /.*test.*/y;
      const match = routeMatch(route, [rcatchRegExp(pattern)]);

      expect(match).toBeTruthy();
      expect(pattern.lastIndex).toBe(0);
    });
  });

  describe('*{(regexp)y}', () => {
    it('matches entry name', () => {

      const route = urlRoute(new URL('http://localhost/prefix-the-test!'));
      const pattern = /.*test.*/y;
      const match = routeMatch(route, [rmatchAny, rcatchRegExp(pattern)]);

      expect(match).toBeTruthy();
      expect(pattern.lastIndex).toBe(0);
    });
  });
});
