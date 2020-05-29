import { pathRouteByURL } from '../path-route';
import { routeMatch } from '../route-match';
import { rmatchAnySuffix } from './rmatch-any-suffix';
import { rmatchRegExp } from './rmatch-regexp';

describe('rmatchRegExp', () => {
  it('matches entry name', () => {

    const route = pathRouteByURL(new URL('http://localhost/the-test!'));

    expect(routeMatch(route, [rmatchRegExp(/.*test.*/)])).toEqual({
      spec: [1, 0],
      results: {},
    });
  });
  it('matches entry name by sticky pattern', () => {

    const route = pathRouteByURL(new URL('http://localhost/the-test!'));
    const pattern = /.*test.*/y;

    expect(routeMatch(route, [rmatchRegExp(pattern)])).toEqual({
      spec: [1, 0],
      results: {},
    });
    expect(pattern.lastIndex).toBe(0);
  });
  it('does not match non-matching entry name', () => {

    const route = pathRouteByURL(new URL('http://localhost/the-test'));

    expect(routeMatch(route, [rmatchRegExp(/test/)])).toBeNull();
  });
  it('captures the first matching group when the pattern is not global', () => {

    const route = pathRouteByURL(new URL('http://localhost/test-TEST'));

    expect(routeMatch(route, [rmatchRegExp(/(test)[-]/i, 'group1', 'group2'), rmatchAnySuffix])).toEqual({
      spec: [1, 0],
      results: {
        group1: 'test',
      },
    });
  });
  it('captures all matching groups when the pattern is global', () => {

    const route = pathRouteByURL(new URL('http://localhost/test-TEST'));

    expect(routeMatch(route, [rmatchRegExp(/(test)[-]*/gi, 'group1', 'group2', 'group3')])).toEqual({
      spec: [2, 0],
      results: {
        group1: 'test',
        group2: 'TEST',
      },
    });
  });
});
