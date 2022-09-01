import { routeCapture } from '../route-capture';
import type { RoutePattern } from '../route-match';
import { routeMatch } from '../route-match';
import { isURL } from '../url/url.impl';
import { MatrixRoute, matrixRoute } from './matrix-route';
import { matrixRoutePattern } from './matrix-route-pattern';

/**
 * Checks whether the given {@link MatrixRoute matrix route} matches {@link matrixRoutePattern matrix route pattern}.
 *
 * @param route - Target route. Can be a string or URL. Uses {@link matrixRoute} to parse it then.
 * @param pattern - Simple pattern to match the route against. Can be as string. Uses {@link matrixRoutePattern}
 * to parse it then.
 *
 * @returns A map of string values of named and anonymous captures, or `null` is the `route` does not match the
 * `pattern`.
 *
 * @see routeCapture  For route capture mapping rules.
 */
export function matchMatrixRoute(
  route: MatrixRoute | URL | string,
  pattern: RoutePattern<MatrixRoute> | string,
): Record<string, string> | null {
  if (typeof route === 'string' || isURL(route)) {
    route = matrixRoute(route);
  }
  if (typeof pattern === 'string') {
    pattern = matrixRoutePattern(pattern);
  }

  const match = routeMatch(route, pattern);

  return match && routeCapture(match);
}

/**
 * An alias of {@link matchMatrixRoute} function.
 */
export { matchMatrixRoute as matchRoute };
