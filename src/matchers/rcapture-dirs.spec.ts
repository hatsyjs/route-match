import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import type { Mock } from 'jest-mock';
import { routeMatch } from '../route-match';
import { urlRoute } from '../url';
import { rcaptureDirs } from './rcapture-dirs';
import { rmatchDirSep } from './rmatch-dir-sep';
import { rmatchName } from './rmatch-name';

describe('rcaptureDirs', () => {

  let captor: Mock<void, any[]>;

  beforeEach(() => {
    captor = jest.fn();
  });

  describe('{capture:**}', () => {

    const pattern = [rcaptureDirs('out')];

    it('does not capture empty route', () => {

      const match = routeMatch(urlRoute(new URL('http://localhost')), pattern);

      expect(match).toBeTruthy();
      match?.(captor);
      expect(captor).not.toHaveBeenCalled();
    });
    it('captures file', () => {
      routeMatch(urlRoute(new URL('http://localhost/file.html')), pattern)?.(captor);
      expect(captor).toHaveBeenCalledWith('dirs', 'out', 1, expect.anything());
      expect(captor).toHaveBeenCalledTimes(1);
    });
    it('captures any route', () => {
      routeMatch(urlRoute(new URL('http://localhost/path/to/file.html')), pattern)?.(captor);
      expect(captor).toHaveBeenCalledWith('dirs', 'out', 3, expect.anything());
      expect(captor).toHaveBeenCalledTimes(1);
    });
  });

  describe('{capture:**}<name>', () => {

    const pattern = [rcaptureDirs('out'), rmatchName('test')];

    it('does not capture named file', () => {

      const match = routeMatch(urlRoute(new URL('http://localhost/test')), pattern);

      expect(match).toBeTruthy();
      match?.(captor);
      expect(captor).not.toHaveBeenCalled();
    });
    it('does not capture named dir', () => {

      const match = routeMatch(urlRoute(new URL('http://localhost/test/')), pattern);

      expect(match).toBeTruthy();
      match?.(captor);
      expect(captor).not.toHaveBeenCalled();
    });
    it('captures nested file', () => {
      routeMatch(urlRoute(new URL('http://localhost/dir/test')), pattern)?.(captor);
      expect(captor).toHaveBeenCalledWith('dirs', 'out', 1, expect.anything());
      expect(captor).toHaveBeenCalledTimes(1);
    });
    it('captures deeply nested dir', () => {
      routeMatch(urlRoute(new URL('http://localhost/path/to/deep/test/')), pattern)?.(captor);
      expect(captor).toHaveBeenCalledWith('dirs', 'out', 3, expect.anything());
      expect(captor).toHaveBeenCalledTimes(1);
    });
  });

  describe('{capture:**}/<name>', () => {

    const pattern = [rcaptureDirs('out'), rmatchDirSep, rmatchName('test')];

    it('does not capture named file', () => {

      const match = routeMatch(urlRoute(new URL('http://localhost/test')), pattern);

      expect(match).toBeTruthy();
      match?.(captor);
      expect(captor).not.toHaveBeenCalled();
    });
    it('does not capture named dir', () => {

      const match = routeMatch(urlRoute(new URL('http://localhost/test/')), pattern);

      expect(match).toBeTruthy();
      match?.(captor);
      expect(captor).not.toHaveBeenCalled();
    });
    it('captures nested file', () => {
      routeMatch(urlRoute(new URL('http://localhost/dir/test')), pattern)?.(captor);
      expect(captor).toHaveBeenCalledWith('dirs', 'out', 1, expect.anything());
      expect(captor).toHaveBeenCalledTimes(1);
    });
    it('captures deeply nested dir', () => {
      routeMatch(urlRoute(new URL('http://localhost/path/to/deep/test/')), pattern)?.(captor);
      expect(captor).toHaveBeenCalledWith('dirs', 'out', 3, expect.anything());
      expect(captor).toHaveBeenCalledTimes(1);
    });
  });

  describe('{capture:/**}', () => {

    const pattern = [rmatchName('test'), rmatchDirSep, rcaptureDirs('out')];

    it('does not capture dir itself', () => {

      const match = routeMatch(urlRoute(new URL('http://localhost/test/')), pattern);

      expect(match).toBeTruthy();
      match?.(captor);
      expect(captor).not.toHaveBeenCalled();
    });
    it('captures nested file', () => {
      routeMatch(urlRoute(new URL('http://localhost/test/file')), pattern)?.(captor);
      expect(captor).toHaveBeenCalledWith('dirs', 'out', 2, expect.anything());
      expect(captor).toHaveBeenCalledTimes(1);
    });
    it('captures nested dir', () => {
      routeMatch(urlRoute(new URL('http://localhost/test/dir/')), pattern)?.(captor);
      expect(captor).toHaveBeenCalledWith('dirs', 'out', 2, expect.anything());
      expect(captor).toHaveBeenCalledTimes(1);
    });
  });
});
