/**
 * @packageDocumentation
 * @module @hatsy/route-match
 */
import { classifyRouteCapture } from './classify-route-capture';
import type { RouteMatch } from './route-match';

/**
 * Extracts captured fragments from the route match.
 *
 * - Extracts named captures under their names as keys.
 * - Extracts anonymous captures under `$N` key, there `N` is capture index.
 * - Extracts {@link RouteCaptorSignatureMap.dirs dirs} as string representations of extracted path.
 * - Extracts {@link RouteCaptorSignatureMap.regexp regexp} match groups in addition to the match itself
 *   under under `<capture_name>$<group_index>` (for named capture), or `<capture_index>$<group_index>` for
 *   anonymous capture.
 * - Extracts named {@link RouteCaptorSignatureMap.regexp regexp} match groups under their names as keys.
 *
 * @param match  A route match to extract capture from, or `null`/`undefined` if there is no match.
 *
 * @returns A map of string values of named and anonymous captures.
 */
export function routeCapture(match: RouteMatch): Record<string, string> {

  const result: Record<string, string> = {};
  const nameOf = (key: string | number): string => typeof key === 'string' ? key : `$${key}`;
  const put = (key: string | number, value: string): void => {
    result[nameOf(key)] = value;
  };

  match(classifyRouteCapture(
      {
        capture: put,
        regexp(key, match: RegExpExecArray) {

          const name = nameOf(key);

          result[name] = match[0];
          for (let i = 1; i < match.length; ++i) {
            result[`${name}$${i}`] = match[i];
          }
          if (match.groups) {
            for (const [group, value] of Object.entries(match.groups)) {
              result[group] = value;
            }
          }
        },
        dirs(key, upto: number, { route, entryIndex }) {
          put(key, String(route.section(entryIndex, upto)));
        },
      },
      (_kind, key, value, _position) => put(key, String(value)),
  ));

  return result;
}
