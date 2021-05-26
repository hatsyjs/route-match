import { describe, expect, it } from '@jest/globals';
import { rcaptureEntry } from '../matchers';
import { matchSimpleRoute } from './match-simple-route';
import { urlRoute } from './url-route';

describe('matchSimpleRoute', () => {
  it('returns `null` when route doe not match', () => {
    expect(matchSimpleRoute('wrong', 'test')).toBeNull();
  });
  it('matches against provided pattern', () => {
    expect(matchSimpleRoute('test', [rcaptureEntry('out')])).toEqual({ out: 'test' });
  });
  it('matches provided URL', () => {
    expect(matchSimpleRoute(new URL('http://localhost/test/'), [rcaptureEntry('out')])).toEqual({ out: 'test' });
  });
  it('matches provided route', () => {
    expect(matchSimpleRoute(urlRoute('test'), [rcaptureEntry('out')])).toEqual({ out: 'test' });
  });
});
