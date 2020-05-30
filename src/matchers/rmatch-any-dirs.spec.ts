import { routeMatch } from '../route-match';
import { urlRoute } from '../url';
import { rmatchAnyDirs } from './rmatch-any-dirs';
import { rmatchDirSep } from './rmatch-dir-sep';
import { rmatchName } from './rmatch-name';

describe('rmatchAnyDirs', () => {
  describe('**', () => {

    const pattern = [rmatchAnyDirs];

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

    const pattern = [rmatchAnyDirs, rmatchName('test')];

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

    const pattern = [rmatchAnyDirs, rmatchDirSep, rmatchName('test')];

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

    const pattern = [rmatchName('test'), rmatchDirSep, rmatchAnyDirs];

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
