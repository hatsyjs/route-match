import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import type { Mock } from 'jest-mock';
import { classifyRouteCapture } from './classify-route-capture';
import { rcaptureEntry } from './matchers';
import type { PathRoute } from './path';
import type { RouteCaptor, RouteCaptorSignatureMap } from './route-captor';
import { routeMatch } from './route-match';
import { urlRoute } from './url';

describe('classifyRouteCapture', () => {
  const pattern = [rcaptureEntry('out')];
  let capture: Mock<
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
    expect(capture).toHaveBeenCalledWith('out', 'file', expect.anything());
    expect(capture).toHaveBeenCalledTimes(1);
  });
  it('does not fall back when capture classified', () => {
    const match = routeMatch(urlRoute(new URL('route:/file')), pattern);

    match?.(classifyRouteCapture({ capture }, fallback));
    expect(fallback).not.toHaveBeenCalled();
  });
  it('falls back when no classifier method found', () => {
    const dirs
      = jest.fn<
        (
          key: string | number,
          ...capture: Parameters<RouteCaptorSignatureMap<PathRoute>['dirs']>
        ) => void
      >(
);
    const match = routeMatch(urlRoute(new URL('route:/file')), pattern);

    match?.(classifyRouteCapture({ dirs }, fallback));
    expect(dirs).not.toHaveBeenCalled();
    expect(fallback).toHaveBeenCalledWith('capture', 'out', 'file', expect.anything());
    expect(fallback).toHaveBeenCalledTimes(1);
  });
});
