import { describe, expect, it } from '@jest/globals';
import { routeMatch } from '../route-match.js';
import { urlRoute } from '../url/url-route.js';
import { rmatchAny } from './rmatch-any.js';
import { rmatchDirSep } from './rmatch-dir-sep.js';
import { rmatchName } from './rmatch-name.js';
import { rmatchString } from './rmatch-string.js';

describe('rmatchDirSep', () => {
  describe('/', () => {
    const pattern = [rmatchDirSep];

    it('matches empty route', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost')), pattern)).toBeTruthy();
    });
    it('does not match file route', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/file')), pattern)).toBeNull();
    });
    it('does not match directory route', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/dir/')), pattern)).toBeNull();
    });
  });

  describe('<string>/', () => {
    const pattern = [rmatchString('test'), rmatchDirSep];

    it('does not match empty route', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost')), pattern)).toBeNull();
    });
    it('does not match file route', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/test')), pattern)).toBeNull();
    });
    it('matches directory route', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/test/')), pattern)).toBeTruthy();
    });
    it('does not match directory route with incomplete prefix', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/test!/')), pattern)).toBeNull();
    });
  });

  describe('<name>/', () => {
    const pattern = [rmatchName('test'), rmatchDirSep];

    it('does not match empty route', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost')), pattern)).toBeNull();
    });
    it('does not match file route', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/test')), pattern)).toBeNull();
    });
    it('matches directory route', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/test/')), pattern)).toBeTruthy();
    });
    it('does not match directory route with incomplete prefix', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/test!/')), pattern)).toBeNull();
    });
  });

  describe('*/<name2>', () => {
    const pattern = [rmatchAny, rmatchDirSep, rmatchName('file')];

    it('does not match empty route', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost')), pattern)).toBeNull();
    });
    it('does not match incomplete route', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/dir/')), pattern)).toBeNull();
    });
    it('matches file route', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/dir/file')), pattern)).toBeTruthy();
    });
    it('matches directory route', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/dir/file/')), pattern)).toBeTruthy();
    });
    it('does not match too long route', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/dir/file/test')), pattern)).toBeNull();
    });
  });
});
