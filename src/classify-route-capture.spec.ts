import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { classifyRouteCapture } from './classify-route-capture.js';
import { rcaptureEntry } from './matchers/rcapture-entry.js';
import { PathRoute } from './path/path-route.js';
import type { RouteCaptor, RouteCaptorSignatureMap } from './route-captor.js';
import { routeMatch } from './route-match.js';
import { RouteMatcher } from './route-matcher.js';
import { urlRoute } from './url/url-route.js';

describe('classifyRouteCapture', () => {
  const pattern = [rcaptureEntry('out')];
  let capture: jest.Mock<
    (
      key: string | number,
      ...capture: Parameters<RouteCaptorSignatureMap<PathRoute>['capture']>
    ) => void
  >;
  let fallback: RouteCaptor;

  beforeEach(() => {
    capture = jest.fn();
    fallback = jest.fn();
  });

  it('classifies capture', () => {
    const match = routeMatch(urlRoute(new URL('route:/file')), pattern);

    match?.(classifyRouteCapture({ capture }));
    expect(capture).toHaveBeenCalledWith(
      'out',
      'file',
      expect.anything() as unknown as RouteMatcher.Context<PathRoute>,
    );
    expect(capture).toHaveBeenCalledTimes(1);
  });
  it('does not fall back when capture classified', () => {
    const match = routeMatch(urlRoute(new URL('route:/file')), pattern);

    match?.(classifyRouteCapture({ capture }, fallback));
    expect(fallback).not.toHaveBeenCalled();
  });
  it('falls back when no classifier method found', () => {
    const dirs =
      jest.fn<
        (
          key: string | number,
          ...capture: Parameters<RouteCaptorSignatureMap<PathRoute>['dirs']>
        ) => void
      >();
    const match = routeMatch(urlRoute(new URL('route:/file')), pattern);

    match?.(classifyRouteCapture({ dirs }, fallback));
    expect(dirs).not.toHaveBeenCalled();
    expect(fallback).toHaveBeenCalledWith(
      'capture',
      'out',
      'file',
      expect.anything() as unknown as RouteMatcher.Context<PathRoute>,
    );
    expect(fallback).toHaveBeenCalledTimes(1);
  });
});
