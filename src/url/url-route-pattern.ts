/**
 * @packageDocumentation
 * @module @hatsy/route-match
 */
import { rmatchDirSep } from '../matchers';
import type { PathRoute } from '../path';
import { pathRouteMatchers } from '../path/path-route-pattern.impl';
import type { RoutePattern } from '../route-match';
import type { RouteMatcher } from '../route-matcher';
import { rmatchSearchParam } from './rmatch-search-param';
import type { URLRoute } from './url-route';

/**
 * Parses URL route pattern.
 *
 * Pattern format:
 *
 * - Empty string corresponds to empty pattern.
 *
 * - `/` matches directory separator.
 *   Corresponds to {@link rmatchDirSep}.
 *
 * - `*` matches a part of route entry name.
 *   Corresponds to {@link rmatchAny} or {@link rmatchEntry}.
 *
 * - `{capture}` captures a part of entry name as `capture`.
 *   Corresponds to {@link rcaptureAny} or {@link rcaptureEntry}.
 *
 * - `/**` matches any number of directories.
 *   Corresponds to {@link rmatchDirs}
 *
 * - `/{capture:**}` captures any number of directories as `capture`.
 *   Corresponds to {@link rcaptureDirs}.
 *
 * - `{(regexp)flags}` matches a part of entry name matching the given regular expression with optional flags.
 *   Corresponds to {@link rcaptureRegExp}.
 *
 * - `{capture(regexp)flags}` captures a part of entry name matching the regular expression with optional flags.
 *   Corresponds to {@link rcaptureRegExp}.
 *
 * - `?name` requires URL search parameter to present.
 *   Corresponds to {@link rmatchSearchParam `rmatchSearchParam('name')`}.
 *
 * - `?name=value` requires URL search parameter to have the given value.
 *   Corresponds to {@link rmatchSearchParam `rmatchSearchParam('name', 'value')`}.
 *
 * - Everything else matches verbatim and corresponds to {@link rmatchString} or {@link rmatchName}.
 *
 * The pattern parts are URL-decoded after parsing. So the pattern string may contain URL-encoded reserved and special
 * characters.
 *
 * @param pattern  Pattern string.
 * @returns Simple route pattern.
 */
export function urlRoutePattern(pattern: string): RoutePattern<PathRoute.Entry, URLRoute> {
  if (!pattern) {
    return [];
  }

  const result: RouteMatcher<PathRoute.Entry, URLRoute>[] = [];
  const [pathPattern, queryPattern] = pattern.split('?');
  const parts = pathPattern.split('/');

  for (const part of parts) {
    if (result.length) {
      result.push(rmatchDirSep);
    }
    if (part) {
      pathRouteMatchers(part, result);
    }
  }

  new URLSearchParams(queryPattern).forEach((_value, param, params) => {
    params.getAll(param).forEach(value => result.push(rmatchSearchParam(param, value || undefined)));
  });

  return result;
}


