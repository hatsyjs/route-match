import { describe, expect, it } from '@jest/globals';
import { matchSimpleRoute } from './match-simple-route.js';
import { urlRoute } from './url-route.js';
import { rcaptureEntry } from '../matchers/rcapture-entry.js';

describe('matchSimpleRoute', () => {
  it('returns `null` when route doe not match', () => {
    expect(matchSimpleRoute('wrong', 'test')).toBeNull();
  });
  it('matches against provided pattern', () => {
    expect(matchSimpleRoute('test', [rcaptureEntry('out')])).toEqual({ out: 'test' });
  });
  it('matches provided URL', () => {
    expect(matchSimpleRoute(new URL('http://localhost/test/'), [rcaptureEntry('out')])).toEqual({
      out: 'test',
    });
  });
  it('matches provided route', () => {
    expect(matchSimpleRoute(urlRoute('test'), [rcaptureEntry('out')])).toEqual({ out: 'test' });
  });
});
