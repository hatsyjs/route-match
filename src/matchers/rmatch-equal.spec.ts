import { pathRouteByURL } from '../path';
import { routeMatch } from '../route-match';
import { rmatchEqual } from './rmatch-equal';

describe('rmatchEqual', () => {
  it('matches file name', () => {

    const route = pathRouteByURL(new URL('http://localhost/test'));

    expect(routeMatch(route, [rmatchEqual('test')])).toEqual({
      spec: [1],
      results: {},
    });
  });
  it('matches dir name', () => {

    const route = pathRouteByURL(new URL('http://localhost/test/'));

    expect(routeMatch(route, [rmatchEqual('test')])).toEqual({
      spec: [1],
      results: {},
    });
  });
  it('does not match prefixed name', () => {

    const route = pathRouteByURL(new URL('http://localhost/the-test/'));

    expect(routeMatch(route, [rmatchEqual('test')], { nameOffset: 4 })).toBeNull();
  });
  it('does not match suffixed name', () => {

    const route = pathRouteByURL(new URL('http://localhost/test!/'));

    expect(routeMatch(route, [rmatchEqual('test')])).toBeNull();
  });
});
