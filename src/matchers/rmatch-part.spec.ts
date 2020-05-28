import { pathRouteByURL } from '../path-route';
import { routeMatch } from '../route-match';
import { rmatchPart } from './rmatch-part';
import { rmatchSuffix } from './rmatch-suffix';

describe('rmatchPart', () => {
  it('matches file name', () => {

    const route = pathRouteByURL(new URL('http://localhost/test'));

    expect(routeMatch(route, [rmatchPart('test')])).toEqual({
      spec: [1, 0],
      results: {},
    });
  });
  it('matches dir name', () => {

    const route = pathRouteByURL(new URL('http://localhost/test/'));

    expect(routeMatch(route, [rmatchPart('test')])).toEqual({
      spec: [1, 0],
      results: {},
    });
  });
  it('matches prefixed name', () => {

    const route = pathRouteByURL(new URL('http://localhost/the-test/'));

    expect(routeMatch(route, [rmatchPart('test')], { nameOffset: 4 })).toEqual({
      spec: [1, 0],
      results: {},
    });
  });
  it('does not match suffixed name', () => {

    const route = pathRouteByURL(new URL('http://localhost/the-test!/'));

    expect(routeMatch(route, [rmatchPart('test')], { nameOffset: 4 })).toBeNull();
  });
  it('matches prefix part and suffix matching another matcher', () => {

    const route = pathRouteByURL(new URL('http://localhost/test!/'));

    expect(routeMatch(route, [rmatchPart('test'), rmatchSuffix])).toEqual({
      spec: [1, 0],
      results: {},
    });
  });
  it('matches subsequent parts', () => {

    const route = pathRouteByURL(new URL('http://localhost/test!/'));

    expect(routeMatch(route, [rmatchPart('test'), rmatchPart('!')])).toEqual({
      spec: [2, 0],
      results: {},
    });
  });
});
