import { routeMatch } from '../route-match';
import { urlRoute } from '../url';
import { rcatchDirs } from './rcatch-dirs';
import { rmatchDirSep } from './rmatch-dir-sep';
import { rmatchName } from './rmatch-name';

describe('rcatchDirs', () => {

  let capture: jest.Mock;

  beforeEach(() => {
    capture = jest.fn();
  });

  describe('{capture:**}', () => {

    const pattern = [rcatchDirs('out')];

    it('does not capture empty route', () => {

      const match = routeMatch(urlRoute(new URL('http://localhost')), pattern);

      expect(match).toBeTruthy();
      match?.(capture);
      expect(capture).not.toHaveBeenCalled();
    });
    it('captures file', () => {
      routeMatch(urlRoute(new URL('http://localhost/file.html')), pattern)?.(capture);
      expect(capture).toHaveBeenCalledWith('dirs', 'out', 1, expect.anything());
      expect(capture).toHaveBeenCalledTimes(1);
    });
    it('captures any route', () => {
      routeMatch(urlRoute(new URL('http://localhost/path/to/file.html')), pattern)?.(capture);
      expect(capture).toHaveBeenCalledWith('dirs', 'out', 3, expect.anything());
      expect(capture).toHaveBeenCalledTimes(1);
    });
  });

  describe('{capture:**}<name>', () => {

    const pattern = [rcatchDirs('out'), rmatchName('test')];

    it('does not capture named file', () => {

      const match = routeMatch(urlRoute(new URL('http://localhost/test')), pattern);

      expect(match).toBeTruthy();
      match?.(capture);
      expect(capture).not.toHaveBeenCalled();
    });
    it('does not capture named dir', () => {

      const match = routeMatch(urlRoute(new URL('http://localhost/test/')), pattern);

      expect(match).toBeTruthy();
      match?.(capture);
      expect(capture).not.toHaveBeenCalled();
    });
    it('captures nested file', () => {
      routeMatch(urlRoute(new URL('http://localhost/dir/test')), pattern)?.(capture);
      expect(capture).toHaveBeenCalledWith('dirs', 'out', 1, expect.anything());
      expect(capture).toHaveBeenCalledTimes(1);
    });
    it('captures deeply nested dir', () => {
      routeMatch(urlRoute(new URL('http://localhost/path/to/deep/test/')), pattern)?.(capture);
      expect(capture).toHaveBeenCalledWith('dirs', 'out', 3, expect.anything());
      expect(capture).toHaveBeenCalledTimes(1);
    });
  });

  describe('{capture:**}/<name>', () => {

    const pattern = [rcatchDirs('out'), rmatchDirSep, rmatchName('test')];

    it('does not capture named file', () => {

      const match = routeMatch(urlRoute(new URL('http://localhost/test')), pattern);

      expect(match).toBeTruthy();
      match?.(capture);
      expect(capture).not.toHaveBeenCalled();
    });
    it('does not capture named dir', () => {

      const match = routeMatch(urlRoute(new URL('http://localhost/test/')), pattern);

      expect(match).toBeTruthy();
      match?.(capture);
      expect(capture).not.toHaveBeenCalled();
    });
    it('captures nested file', () => {
      routeMatch(urlRoute(new URL('http://localhost/dir/test')), pattern)?.(capture);
      expect(capture).toHaveBeenCalledWith('dirs', 'out', 1, expect.anything());
      expect(capture).toHaveBeenCalledTimes(1);
    });
    it('captures deeply nested dir', () => {
      routeMatch(urlRoute(new URL('http://localhost/path/to/deep/test/')), pattern)?.(capture);
      expect(capture).toHaveBeenCalledWith('dirs', 'out', 3, expect.anything());
      expect(capture).toHaveBeenCalledTimes(1);
    });
  });

  describe('{capture:/**}', () => {

    const pattern = [rmatchName('test'), rmatchDirSep, rcatchDirs('out')];

    it('does not capture dir itself', () => {

      const match = routeMatch(urlRoute(new URL('http://localhost/test/')), pattern);

      expect(match).toBeTruthy();
      match?.(capture);
      expect(capture).not.toHaveBeenCalled();
    });
    it('captures nested file', () => {
      routeMatch(urlRoute(new URL('http://localhost/test/file')), pattern)?.(capture);
      expect(capture).toHaveBeenCalledWith('dirs', 'out', 2, expect.anything());
      expect(capture).toHaveBeenCalledTimes(1);
    });
    it('captures nested dir', () => {
      routeMatch(urlRoute(new URL('http://localhost/test/dir/')), pattern)?.(capture);
      expect(capture).toHaveBeenCalledWith('dirs', 'out', 2, expect.anything());
      expect(capture).toHaveBeenCalledTimes(1);
    });
  });
});
