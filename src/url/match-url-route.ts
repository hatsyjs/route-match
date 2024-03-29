import { routeCapture } from '../route-capture.js';
import type { RoutePattern } from '../route-match.js';
import { routeMatch } from '../route-match.js';
import { URLRoute, urlRoute } from './url-route.js';
import { urlRoutePattern } from './url-route-pattern.js';
import { isURL } from './url.impl.js';

/**
 * Checks whether the given route matches {@link urlRoutePattern URL pattern}.
 *
 * @param route - Target route. Can be a string or URL. Uses {@link urlRoute} to parse it then.
 * @param pattern - Simple pattern to match the route against. Can be as string. Uses {@link urlRoutePattern}
 * to parse it then.
 *
 * @returns A map of string values of named and anonymous captures, or `null` is the `route` does not match the
 * `pattern`.
 *
 * @see routeCapture  For route capture mapping rules.
 */
export function matchURLRoute(
  route: URLRoute | URL | string,
  pattern: RoutePattern<URLRoute> | string,
): Record<string, string> | null {
  if (typeof route === 'string' || isURL(route)) {
    route = urlRoute(route);
  }
  if (typeof pattern === 'string') {
    pattern = urlRoutePattern(pattern);
  }

  const match = routeMatch(route, pattern);

  return match && routeCapture(match);
}
