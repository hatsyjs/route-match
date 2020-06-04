import { routeMatch } from '../route-match';
import { urlRoute } from '../url';
import { rcaptureAny } from './rcapture-any';
import { rcaptureRegExp } from './rcapture-regexp';
import { rmatchAny } from './rmatch-any';

describe('rcaptureRegExp', () => {

  let capture: jest.Mock;

  beforeEach(() => {
    capture = jest.fn();
  });

  describe('{capture(regexp)}', () => {
    it('captures entry name', () => {

      const route = urlRoute(new URL('http://localhost/the-test!'));
      const match = routeMatch(route, [rcaptureRegExp(/.*test.*/, 'out')]);

      match?.(capture);
      expect(capture).toHaveBeenCalledWith('regexp', 'out', expect.anything(), expect.anything());
      expect([...capture.mock.calls[0][2]]).toEqual(['the-test!']);
      expect(capture).toHaveBeenCalledTimes(1);
    });
    it('does not match non-matching entry name', () => {

      const route = urlRoute(new URL('http://localhost/test!'));

      expect(routeMatch(route, [rcaptureRegExp(/test$/)])).toBeNull();
    });
    it('captures the first matching group when the pattern is not global', () => {

      const route = urlRoute(new URL('http://localhost/test-TEST'));
      const match = routeMatch(route, [rcaptureRegExp(/(test)/i, 'out'), rmatchAny]);

      match?.(capture);
      expect(capture).toHaveBeenCalledWith('regexp', 'out', expect.anything(), expect.anything());
      expect([...capture.mock.calls[0][2]]).toEqual(['test', 'test']);
      expect(capture).toHaveBeenCalledWith('capture', 1, '-TEST', expect.anything());
      expect(capture).toHaveBeenCalledTimes(2);
    });
  });

  describe('{capture1}{capture2(regexp)}', () => {
    it('captures both captures', () => {

      const route = urlRoute(new URL('http://localhost/the-test!'));
      const pattern = [rcaptureAny('prefix'), rcaptureRegExp(/test.*/, 'out')];
      let match = routeMatch(route, pattern);

      match?.(capture);
      expect(capture).toHaveBeenCalledWith('capture', 'prefix', 'the-', expect.anything());
      expect(capture).toHaveBeenCalledWith('regexp', 'out', expect.anything(), expect.anything());
      expect([...capture.mock.calls[1][2]]).toEqual(['test!']);
      expect(capture).toHaveBeenCalledTimes(2);

      // Test again with cached search pattern
      capture.mockClear();
      match = routeMatch(route, pattern);
      match?.(capture);
      expect(capture).toHaveBeenCalledWith('capture', 'prefix', 'the-', expect.anything());
      expect(capture).toHaveBeenCalledWith('regexp', 'out', expect.anything(), expect.anything());
      expect([...capture.mock.calls[1][2]]).toEqual(['test!']);
      expect(capture).toHaveBeenCalledTimes(2);
    });
    it('captures only regexp when prefix is missing', () => {

      const route = urlRoute(new URL('http://localhost/test!'));
      const match = routeMatch(route, [rcaptureAny('prefix'), rcaptureRegExp(/test.*/, 'out')]);

      match?.(capture);
      expect(capture).toHaveBeenCalledWith('regexp', 'out', expect.anything(), expect.anything());
      expect([...capture.mock.calls[0][2]]).toEqual(['test!']);
      expect(capture).toHaveBeenCalledTimes(1);
    });
    it('does not match non-matching entry name', () => {

      const route = urlRoute(new URL('http://localhost/the-test!'));

      expect(routeMatch(route, [rcaptureAny('prefix'), rcaptureRegExp(/test$/)])).toBeNull();
    });
  });

  describe('{capture(regexp)g}', () => {
    it('captures all matching groups', () => {

      const route = urlRoute(new URL('http://localhost/test-TEST'));
      const match = routeMatch(route, [rcaptureRegExp(/(test)-?/gi, 'out')]);

      match?.(capture);
      expect(capture).toHaveBeenCalledWith('regexp', 'out', expect.anything(), expect.anything());
      expect([...capture.mock.calls[0][2]]).toEqual(['test-', 'test']);
      expect([...capture.mock.calls[1][2]]).toEqual(['TEST', 'TEST']);
      expect(capture).toHaveBeenCalledTimes(2);
    });
  });

  describe('*{capture(regexp)g}', () => {
    it('captures all matching groups', () => {

      const route = urlRoute(new URL('http://localhost/prefix-test-TEST'));
      const match = routeMatch(route, [rmatchAny, rcaptureRegExp(/(test)-?/gi, 'out')]);

      match?.(capture);
      expect(capture).toHaveBeenCalledWith('capture', 1, 'prefix-', expect.anything());
      expect(capture).toHaveBeenCalledWith('regexp', 'out', expect.anything(), expect.anything());
      expect([...capture.mock.calls[1][2]]).toEqual(['test-', 'test']);
      expect([...capture.mock.calls[2][2]]).toEqual(['TEST', 'TEST']);
      expect(capture).toHaveBeenCalledTimes(3);
    });
  });

  describe('{(regexp)y}', () => {
    it('matches entry name', () => {

      const route = urlRoute(new URL('http://localhost/the-test!'));
      const pattern = /.*test.*/y;
      const match = routeMatch(route, [rcaptureRegExp(pattern)]);

      expect(match).toBeTruthy();
      expect(pattern.lastIndex).toBe(0);
    });
  });

  describe('*{(regexp)y}', () => {
    it('matches entry name', () => {

      const route = urlRoute(new URL('http://localhost/prefix-the-test!'));
      const pattern = /.*test.*/y;
      const match = routeMatch(route, [rmatchAny, rcaptureRegExp(pattern)]);

      expect(match).toBeTruthy();
      expect(pattern.lastIndex).toBe(0);
    });
  });
});
