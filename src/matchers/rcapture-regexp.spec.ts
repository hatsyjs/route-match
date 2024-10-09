import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { routeMatch } from '../route-match.js';
import { urlRoute } from '../url/url-route.js';
import { rcaptureAny } from './rcapture-any.js';
import { rcaptureRegExp } from './rcapture-regexp.js';
import { rmatchAny } from './rmatch-any.js';

describe('rcaptureRegExp', () => {
  let captor: jest.Mock<(kind: unknown, key: string | number, ...capture: any[]) => void>;

  beforeEach(() => {
    captor = jest.fn();
  });

  describe('{capture(regexp)}', () => {
    it('captures entry name', () => {
      const route = urlRoute(new URL('http://localhost/the-test!'));
      const match = routeMatch(route, [rcaptureRegExp(/.*test.*/, 'out')]);

      match?.(captor);
      expect(captor).toHaveBeenCalledWith('regexp', 'out', expect.anything(), expect.anything());
      expect([...captor.mock.calls[0][2]]).toEqual(['the-test!']);
      expect(captor).toHaveBeenCalledTimes(1);
    });
    it('does not match non-matching entry name', () => {
      const route = urlRoute(new URL('http://localhost/test!'));

      expect(routeMatch(route, [rcaptureRegExp(/test$/)])).toBeNull();
    });
    it('captures the first matching group when the pattern is not global', () => {
      const route = urlRoute(new URL('http://localhost/test-TEST'));
      const match = routeMatch(route, [rcaptureRegExp(/(test)/i, 'out'), rmatchAny]);

      match?.(captor);
      expect(captor).toHaveBeenCalledWith('regexp', 'out', expect.anything(), expect.anything());
      expect([...captor.mock.calls[0][2]]).toEqual(['test', 'test']);
      expect(captor).toHaveBeenCalledWith('capture', 1, '-TEST', expect.anything());
      expect(captor).toHaveBeenCalledTimes(2);
    });
  });

  describe('{capture1}{capture2(regexp)}', () => {
    it('captures both captures', () => {
      const route = urlRoute(new URL('http://localhost/the-test!'));
      const pattern = [rcaptureAny('prefix'), rcaptureRegExp(/test.*/, 'out')];
      let match = routeMatch(route, pattern);

      match?.(captor);
      expect(captor).toHaveBeenCalledWith('capture', 'prefix', 'the-', expect.anything());
      expect(captor).toHaveBeenCalledWith('regexp', 'out', expect.anything(), expect.anything());
      expect([...captor.mock.calls[1][2]]).toEqual(['test!']);
      expect(captor).toHaveBeenCalledTimes(2);

      // Test again with cached search pattern
      captor.mockClear();
      match = routeMatch(route, pattern);
      match?.(captor);
      expect(captor).toHaveBeenCalledWith('capture', 'prefix', 'the-', expect.anything());
      expect(captor).toHaveBeenCalledWith('regexp', 'out', expect.anything(), expect.anything());
      expect([...captor.mock.calls[1][2]]).toEqual(['test!']);
      expect(captor).toHaveBeenCalledTimes(2);
    });
    it('captures only regexp when prefix is missing', () => {
      const route = urlRoute(new URL('http://localhost/test!'));
      const match = routeMatch(route, [rcaptureAny('prefix'), rcaptureRegExp(/test.*/, 'out')]);

      match?.(captor);
      expect(captor).toHaveBeenCalledWith('regexp', 'out', expect.anything(), expect.anything());
      expect([...captor.mock.calls[0][2]]).toEqual(['test!']);
      expect(captor).toHaveBeenCalledTimes(1);
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

      match?.(captor);
      expect(captor).toHaveBeenCalledWith('regexp', 'out', expect.anything(), expect.anything());
      expect([...captor.mock.calls[0][2]]).toEqual(['test-', 'test']);
      expect([...captor.mock.calls[1][2]]).toEqual(['TEST', 'TEST']);
      expect(captor).toHaveBeenCalledTimes(2);
    });
  });

  describe('*{capture(regexp)g}', () => {
    it('captures all matching groups', () => {
      const route = urlRoute(new URL('http://localhost/prefix-test-TEST'));
      const match = routeMatch(route, [rmatchAny, rcaptureRegExp(/(test)-?/gi, 'out')]);

      match?.(captor);
      expect(captor).toHaveBeenCalledWith('capture', 1, 'prefix-', expect.anything());
      expect(captor).toHaveBeenCalledWith('regexp', 'out', expect.anything(), expect.anything());
      expect([...captor.mock.calls[1][2]]).toEqual(['test-', 'test']);
      expect([...captor.mock.calls[2][2]]).toEqual(['TEST', 'TEST']);
      expect(captor).toHaveBeenCalledTimes(3);
    });
  });

  describe('{(regexp)y}', () => {
    it('captures entry name', () => {
      const route = urlRoute(new URL('http://localhost/the-test!'));
      const pattern = /.*test.*/y;
      const match = routeMatch(route, [rcaptureRegExp(pattern)]);

      expect(pattern.lastIndex).toBe(0);
      match?.(captor);
      expect(captor).toHaveBeenCalledWith('regexp', 1, expect.anything(), expect.anything());
      expect([...captor.mock.calls[0][2]]).toEqual(['the-test!']);
      expect(captor).toHaveBeenCalledTimes(1);
    });
  });

  describe('*{(regexp)y}', () => {
    it('captures entry name', () => {
      const route = urlRoute(new URL('http://localhost/prefix-the-test!'));
      const pattern = /.*test.*/y;
      const match = routeMatch(route, [rmatchAny, rcaptureRegExp(pattern)]);

      expect(pattern.lastIndex).toBe(0);
      match?.(captor);
      expect(captor).toHaveBeenCalledWith('regexp', 1, expect.anything(), expect.anything());
      expect([...captor.mock.calls[0][2]]).toEqual(['prefix-the-test!']);
      expect(captor).toHaveBeenCalledTimes(1);
    });
  });
});
