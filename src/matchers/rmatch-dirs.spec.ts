import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { RouteCaptor } from '../route-captor';
import { routeMatch } from '../route-match';
import { URLRoute, urlRoute } from '../url';
import { rmatchDirSep } from './rmatch-dir-sep';
import { rmatchDirs } from './rmatch-dirs';
import { rmatchName } from './rmatch-name';

describe('rmatchDirs', () => {

  let captor: RouteCaptor<URLRoute>;

  beforeEach(() => {
    captor = jest.fn();
  });

  describe('**', () => {

    const pattern = [rmatchDirs];

    it('does not capture empty route', () => {

      const match = routeMatch(urlRoute(new URL('http://localhost')), pattern);

      expect(match).toBeTruthy();
      match?.(captor);
      expect(captor).not.toHaveBeenCalled();
    });
    it('captures file', () => {

      const match = routeMatch(urlRoute(new URL('http://localhost/file.html')), pattern);

      match?.(captor);
      expect(captor).toHaveBeenCalledWith('dirs', 1, 1, expect.anything());
      expect(captor).toHaveBeenCalledTimes(1);
    });
    it('captures any route', () => {

      const match = routeMatch(urlRoute(new URL('http://localhost/path/to/file.html')), pattern);

      match?.(captor);
      expect(captor).toHaveBeenCalledWith('dirs', 1, 3, expect.anything());
      expect(captor).toHaveBeenCalledTimes(1);
    });
    it('is not applicable inside entry', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/path')), pattern, { nameOffset: 1 })).toBeNull();
    });
  });

  describe('**<name>', () => {

    const pattern = [rmatchDirs, rmatchName('test')];

    it('does not match empty route', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost')), pattern)).toBeNull();
    });
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
    it('does not match dir with extra entries', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/test/extra.html')), pattern)).toBeNull();
    });
    it('captures nested file', () => {

      const match = routeMatch(urlRoute(new URL('http://localhost/dir/test')), pattern);

      match?.(captor);
      expect(captor).toHaveBeenCalledWith('dirs', 1, 1, expect.anything());
      expect(captor).toHaveBeenCalledTimes(1);
    });
    it('captures deeply nested dir', () => {

      const match = routeMatch(urlRoute(new URL('http://localhost/path/to/deep/test/')), pattern);

      match?.(captor);
      expect(captor).toHaveBeenCalledWith('dirs', 1, 3, expect.anything());
      expect(captor).toHaveBeenCalledTimes(1);
    });
  });

  describe('**/<name>', () => {

    const pattern = [rmatchDirs, rmatchDirSep, rmatchName('test')];

    it('does not match empty route', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost')), pattern)).toBeNull();
    });
    it('matches named file', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/test')), pattern)).toBeTruthy();
    });
    it('matches name dir', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/test/')), pattern)).toBeTruthy();
    });
    it('does not match dir with extra entries', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/test/extra.html')), pattern)).toBeNull();
    });
    it('matches nested file', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/dir/test')), pattern)).toBeTruthy();
    });
    it('matches deeply nested dir', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/path/to/deep/test/')), pattern)).toBeTruthy();
    });
  });

  describe('<name>/**', () => {

    const pattern = [rmatchName('test'), rmatchDirSep, rmatchDirs];

    it('matches dir itself', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/test/')), pattern)).toBeTruthy();
    });
    it('matches nested file', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/test/file')), pattern)).toBeTruthy();
    });
    it('matches nested dir', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/test/dir/')), pattern)).toBeTruthy();
    });
  });
});
