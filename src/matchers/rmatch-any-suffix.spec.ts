import { pathRouteByURL } from '../path-route';
import { routeMatch } from '../route-match';
import { rmatchAnySuffix } from './rmatch-any-suffix';

describe('rmatchAnySuffix', () => {
  it('matches file entry', () => {

    const route = pathRouteByURL(new URL('http://localhost/test'));

    expect(routeMatch(route, [rmatchAnySuffix])).toEqual({
      spec: [],
      results: {},
    });
  });
  it('matches dir entry', () => {

    const route = pathRouteByURL(new URL('http://localhost/test/'));

    expect(routeMatch(route, [rmatchAnySuffix])).toEqual({
      spec: [],
      results: {},
    });
  });
});
