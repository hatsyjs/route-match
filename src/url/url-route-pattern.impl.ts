import { rmatchDirSep } from '../matchers';
import type { PathRoute } from '../path';
import type { RoutePattern } from '../route-match';
import type { RouteMatcher } from '../route-matcher';
import { rmatchSearchParam } from './rmatch-search-param';
import type { URLRoute } from './url-route';

/**
 * @internal
 */
export function parseURLRoutePattern<TEntry extends PathRoute.Entry, TRoute extends URLRoute<TEntry>>(
    pattern: string,
    addEntryMatchers: (pattern: string, matchers: RouteMatcher<TEntry, TRoute>[]) => void,
): RoutePattern<TEntry, TRoute> {
  if (!pattern) {
    return [];
  }

  const matchers: RouteMatcher<TEntry, TRoute>[] = [];
  const [pathPattern, queryPattern] = pattern.split('?');
  const parts = pathPattern.split('/');

  for (const part of parts) {
    if (matchers.length) {
      matchers.push(rmatchDirSep);
    }
    if (part) {
      addEntryMatchers(part, matchers);
    }
  }

  new URLSearchParams(queryPattern).forEach((_value, param, params) => {
    params.getAll(param).forEach(value => matchers.push(rmatchSearchParam(param, value || undefined)));
  });

  return matchers;
}
