import { routeMatch } from '../route-match';
import { urlRoute } from '../url';
import { rmatchDirSep } from './rmatch-dir-sep';
import { rmatchDirs } from './rmatch-dirs';
import { rmatchName } from './rmatch-name';

describe('rmatchDirs', () => {
  describe('**', () => {

    const pattern = [rmatchDirs];

    it('matches empty route', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost')), pattern)).toBeTruthy();
    });
    it('matches file', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/file.html')), pattern)).toBeTruthy();
    });
    it('matches any route', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/path/to/file.html')), pattern)).toBeTruthy();
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
    it('matches named file', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/test')), pattern)).toBeTruthy();
    });
    it('matches named dir', () => {
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
