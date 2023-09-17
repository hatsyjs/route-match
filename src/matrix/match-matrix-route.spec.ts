import { describe, expect, it } from '@jest/globals';
import { matchMatrixRoute } from './match-matrix-route.js';
import { matrixRoute } from './matrix-route.js';
import { rmatchMatrixAttr } from './rmatch-matrix-attr.js';
import { rcaptureEntry } from '../matchers/rcapture-entry.js';

describe('matchMatrixRoute', () => {
  it('returns `null` when route doe not match', () => {
    expect(matchMatrixRoute('test', [rmatchMatrixAttr('attr')])).toBeNull();
  });
  it('matches against provided pattern', () => {
    expect(matchMatrixRoute('test', [rcaptureEntry('out')])).toEqual({ out: 'test' });
  });
  it('matches provided URL', () => {
    expect(
      matchMatrixRoute(
        new URL('http://localhost/dir;attr=value/test.html'),
        '{dir};attr/{file}.{ext}',
      ),
    ).toEqual({
      dir: 'dir',
      file: 'test',
      ext: 'html',
    });
  });
  it('matches provided route', () => {
    expect(
      matchMatrixRoute(matrixRoute('dir;attr=value/test.html'), '{dir};attr/{file}.{ext}'),
    ).toEqual({
      dir: 'dir',
      file: 'test',
      ext: 'html',
    });
  });
});
