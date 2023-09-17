import { rmatchDirSep } from '../matchers/rmatch-dir-sep.js';
import type { RoutePattern } from '../route-match.js';
import type { RouteMatcher } from '../route-matcher.js';
import { rmatchSearchParam } from './rmatch-search-param.js';
import type { URLRoute } from './url-route.js';

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
