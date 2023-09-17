import { describe, expect, it } from '@jest/globals';
import { routeMatch } from '../route-match.js';
import { matrixRoute } from './matrix-route.js';
import { rmatchMatrixAttr } from './rmatch-matrix-attr.js';
import { rmatchEntry } from '../matchers/rmatch-entry.js';
import { rmatchDirSep } from '../matchers/rmatch-dir-sep.js';
import { rmatchName } from '../matchers/rmatch-name.js';

describe('rmatchMatrixAttr', () => {
  describe('*;param', () => {
    const pattern = [rmatchEntry, rmatchMatrixAttr('param')];

    it('matches entry with required attribute without value', () => {
      expect(routeMatch(matrixRoute(new URL('http://localhost/path;param')), pattern)).toBeTruthy();
    });
    it('matches entry with required attribute with value', () => {
      expect(
        routeMatch(matrixRoute(new URL('http://localhost/path;param=value')), pattern),
      ).toBeTruthy();
    });
    it('does not match entry without required attribute', () => {
      expect(
        routeMatch(matrixRoute(new URL('http://localhost/path;other=value')), pattern),
      ).toBeNull();
    });
  });

  describe('*;param=value', () => {
    const pattern = [rmatchEntry, rmatchMatrixAttr('param', 'value 1')];

    it('does not match match entry with required attribute without value', () => {
      expect(routeMatch(matrixRoute(new URL('http://localhost/path;param')), pattern)).toBeNull();
    });
    it('matches entry with required attribute with required value', () => {
      expect(
        routeMatch(matrixRoute(new URL('http://localhost/path;param=value%201')), pattern),
      ).toBeTruthy();
    });
    it('matches entry if one of required attribute values matches', () => {
      expect(
        routeMatch(
          matrixRoute(new URL('http://localhost/path;param=wrong;param=value+1')),
          pattern,
        ),
      ).toBeTruthy();
    });
    it('does not match entry without required attribute', () => {
      expect(
        routeMatch(matrixRoute(new URL('http://localhost/path;other=value')), pattern),
      ).toBeNull();
    });
    it('does not match entry if required attribute has wrong value', () => {
      expect(
        routeMatch(matrixRoute(new URL('http://localhost/path;param=wrong')), pattern),
      ).toBeNull();
    });
  });

  describe('dir/;param=value', () => {
    const pattern = [rmatchName('dir'), rmatchDirSep, rmatchMatrixAttr('param', 'value')];

    it('does not match when wrong entry has attribute', () => {
      expect(
        routeMatch(matrixRoute(new URL('http://localhost/dir;param=value/')), pattern),
      ).toBeNull();
    });
    it('matches when the right entry has attribute', () => {
      expect(
        routeMatch(matrixRoute(new URL('http://localhost/dir/;param=value')), pattern),
      ).toBeTruthy();
    });
  });
});
