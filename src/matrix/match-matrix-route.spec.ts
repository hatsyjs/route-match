import { describe, expect, it } from '@jest/globals';
import { rcaptureEntry } from '../matchers';
import { matchMatrixRoute } from './match-matrix-route';
import { matrixRoute } from './matrix-route';
import { rmatchMatrixAttr } from './rmatch-matrix-attr';

describe('matchMatrixRoute', () => {
  it('returns `null` when route doe not match', () => {
    expect(matchMatrixRoute('test', [rmatchMatrixAttr('attr')])).toBeNull();
  });
  it('matches against provided pattern', () => {
    expect(matchMatrixRoute('test', [rcaptureEntry('out')])).toEqual({ out: 'test' });
  });
  it('matches provided URL', () => {
    expect(matchMatrixRoute(new URL('http://localhost/dir;attr=value/test.html'), '{dir};attr/{file}.{ext}')).toEqual({
      dir: 'dir',
      file: 'test',
      ext: 'html',
    });
  });
  it('matches provided route', () => {
    expect(matchMatrixRoute(matrixRoute('dir;attr=value/test.html'), '{dir};attr/{file}.{ext}')).toEqual({
      dir: 'dir',
      file: 'test',
      ext: 'html',
    });
  });
});
