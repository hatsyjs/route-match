/**
 * @packageDocumentation
 * @module @hatsy/route-match
 */
import type { PathRoute } from '../path';
import { simpleRoutePattern } from '../path';
import { routeCapture } from '../route-capture';
import type { RoutePattern } from '../route-match';
import { routeMatch } from '../route-match';
import { urlRoute } from './url-route';
import { isURL } from './url.impl';

/**
 * Checks whether the given route matches {@link simpleRoutePattern simple pattern}.
 *
 * @param route  Target route. Can be a string or URL. Uses {@link urlRoute} to parse it then.
 * @param pattern  Simple pattern to match the route against. Can be as string. Uses {@link simpleRoutePattern}
 * to parse it then.
 *
 * @returns A map of string values of named and anonymous captures, or `null` is the `route` does not match the
 * `pattern`.
 *
 * @see routeCapture  For route capture mapping rules.
 */
export function matchSimpleRoute(
    route: PathRoute | URL | string,
    pattern: RoutePattern | string,
): Record<string, string> | null {
  if (typeof route === 'string' || isURL(route)) {
    route = urlRoute(route);
  }
  if (typeof pattern === 'string') {
    pattern = simpleRoutePattern(pattern);
  }

  const match = routeMatch(route, pattern);

  return match && routeCapture(match);
}
