import { rcaptureEntry } from './matchers';
import { classifyRouteCapture } from './route-captor';
import { routeMatch } from './route-match';
import { urlRoute } from './url';

describe('classifyRouteCapture', () => {

  const pattern = [rcaptureEntry('out')];
  let receiver: jest.Mock;
  let fallback: jest.Mock;

  beforeEach(() => {
    receiver = jest.fn();
    fallback = jest.fn();
  });

  it('classifies capture', () => {

    const match = routeMatch(urlRoute(new URL('route:/file')), pattern);

    match?.(classifyRouteCapture({ capture: receiver }));
    expect(receiver).toHaveBeenCalledWith('out', 'file', expect.anything());
    expect(receiver).toHaveBeenCalledTimes(1);
  });
  it('does not fall back when capture classified', () => {

    const match = routeMatch(urlRoute(new URL('route:/file')), pattern);

    match?.(classifyRouteCapture({ capture: receiver }, fallback));
    expect(fallback).not.toHaveBeenCalled();
  });
  it('falls back when no classifier method found', () => {

    const match = routeMatch(urlRoute(new URL('route:/file')), pattern);

    match?.(classifyRouteCapture({ dirs: receiver }, fallback));
    expect(receiver).not.toHaveBeenCalled();
    expect(fallback).toHaveBeenCalledWith('capture', 'out', 'file', expect.anything());
    expect(fallback).toHaveBeenCalledTimes(1);
  });
});
