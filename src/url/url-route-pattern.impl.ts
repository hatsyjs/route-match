import { rmatchDirSep } from '../matchers';
import type { RoutePattern } from '../route-match';
import type { RouteMatcher } from '../route-matcher';
import { rmatchSearchParam } from './rmatch-search-param';
import type { URLRoute } from './url-route';

/**
 * @internal
 */
export function parseURLRoutePattern<TRoute extends URLRoute>(
  pattern: string,
  addEntryMatchers: (pattern: string, matchers: RouteMatcher<TRoute>[]) => void,
): RoutePattern<TRoute> {
  if (!pattern) {
    return [];
  }

  const matchers: RouteMatcher<TRoute>[] = [];
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

  new URLSearchParams(queryPattern).forEach((value, param) => {
    matchers.push(rmatchSearchParam(param, value || undefined));
  });

  return matchers;
}
