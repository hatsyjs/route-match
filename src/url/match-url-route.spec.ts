import { describe, expect, it } from '@jest/globals';
import { matchURLRoute } from './match-url-route.js';
import { rmatchSearchParam } from './rmatch-search-param.js';
import { urlRoute } from './url-route.js';
import { rcaptureEntry } from '../matchers/rcapture-entry.js';

describe('matchURLRoute', () => {
  it('returns `null` when route doe not match', () => {
    expect(matchURLRoute('test', [rmatchSearchParam('param')])).toBeNull();
  });
  it('matches against provided pattern', () => {
    expect(matchURLRoute('test', [rcaptureEntry('out')])).toEqual({ out: 'test' });
  });
  it('matches provided URL', () => {
    expect(matchURLRoute(new URL('http://localhost/test.html'), '{file}.{ext}')).toEqual({
      file: 'test',
      ext: 'html',
    });
  });
  it('matches provided route', () => {
    expect(matchURLRoute(urlRoute('test.html?param=value'), '{file}.{ext}?param')).toEqual({
      file: 'test',
      ext: 'html',
    });
  });
});
