import { pathRouteByURL } from '../path-route';
import { routeMatch } from '../route-match';
import { rmatchSuffix } from './rmatch-suffix';

describe('rmatchSuffix', () => {
  it('matches file entry', () => {

    const route = pathRouteByURL(new URL('http://localhost/test'));

    expect(routeMatch(route, [rmatchSuffix])).toEqual({
      spec: [],
      results: {},
    });
  });
  it('matches dir entry', () => {

    const route = pathRouteByURL(new URL('http://localhost/test/'));

    expect(routeMatch(route, [rmatchSuffix])).toEqual({
      spec: [],
      results: {},
    });
  });
});
