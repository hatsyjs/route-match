import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import type { Mock } from 'jest-mock';
import { routeMatch, RoutePattern } from '../route-match';
import { urlRoute } from '../url';
import { rcaptureAny } from './rcapture-any';
import { rmatchAny } from './rmatch-any';
import { rmatchDirSep } from './rmatch-dir-sep';
import { rmatchString } from './rmatch-string';

describe('rcaptureAny', () => {

  let captor: Mock<void, any[]>;

  beforeEach(() => {
    captor = jest.fn();
  });

  describe('{capture}', () => {

    let pattern: RoutePattern;

    beforeEach(() => {
      pattern = [rcaptureAny('out')];
    });

    it('does not match empty route', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/')), pattern)).toBeNull();
    });
    it('matches file', () => {

      const match = routeMatch(urlRoute(new URL('http://localhost/file')), pattern);

      match?.(captor);
      expect(captor).toHaveBeenCalledWith('capture', 'out', 'file', expect.anything());
    });
    it('captures directory', () => {

      const match = routeMatch(urlRoute(new URL('http://localhost/dir/')), pattern);

      match?.(captor);
      expect(captor).toHaveBeenCalledWith('capture', 'out', 'dir', expect.anything());
      expect(captor).toHaveBeenCalledTimes(1);
    });
    it('does not match multiple entries', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/dir/file')), pattern)).toBeNull();
    });
  });

  describe('{capture}/*', () => {

    let pattern: RoutePattern;

    beforeEach(() => {
      pattern = [rcaptureAny('out'), rmatchDirSep, rmatchAny];
    });

    it('captures two entries', () => {

      const match = routeMatch(urlRoute(new URL('http://localhost/dir/file')), pattern);

      match?.(captor);
      expect(captor).toHaveBeenCalledWith('capture', 'out', 'dir', expect.anything());
      expect(captor).toHaveBeenCalledWith('capture', 1, 'file', expect.anything());
      expect(captor).toHaveBeenCalledTimes(2);
    });
  });

  describe('*/{capture}', () => {

    let pattern: RoutePattern;

    beforeEach(() => {
      pattern = [rmatchAny, rmatchDirSep, rcaptureAny('out')];
    });

    it('captures two entries', () => {

      const match = routeMatch(urlRoute(new URL('http://localhost/dir/file')), pattern);

      match?.(captor);
      expect(captor).toHaveBeenCalledWith('capture', 1, 'dir', expect.anything());
      expect(captor).toHaveBeenCalledWith('capture', 'out', 'file', expect.anything());
      expect(captor).toHaveBeenCalledTimes(2);
    });
  });

  describe('<string>{capture}', () => {

    let pattern: RoutePattern;

    beforeEach(() => {
      pattern = [rmatchString('page-'), rcaptureAny('out')];
    });

    it('captures file', () => {

      const match = routeMatch(urlRoute(new URL('http://localhost/page-1')), pattern);

      match?.(captor);
      expect(captor).toHaveBeenCalledWith('capture', 'out', '1', expect.anything());
      expect(captor).toHaveBeenCalledTimes(1);
    });
    it('does not match file with wrong prefix', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/page1')), pattern)).toBeNull();
    });
  });

  describe('{capture}<string>', () => {

    let pattern: RoutePattern;

    beforeEach(() => {
      pattern = [rcaptureAny('out'), rmatchString('.html')];
    });

    it('captures file', () => {

      const match = routeMatch(urlRoute(new URL('http://localhost/index.html')), pattern);

      match?.(captor);
      expect(captor).toHaveBeenCalledWith('capture', 'out', 'index', expect.anything());
      expect(captor).toHaveBeenCalledTimes(1);
    });
    it('does not match file with wrong suffix', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/index.htm')), pattern)).toBeNull();
    });
  });
});
