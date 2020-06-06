/**
 * @packageDocumentation
 * @module @hatsy/route-match
 */
import type { PathRoute } from './path';

/**
 * Extracts a tail of the given route starting at the given entry index.
 *
 * When the original route is empty or the tail start index is not positive, then returns the route itself.
 *
 * When the tail start index is greater or equal to the route length, then returns a directory route with empty path.
 *
 * @typeparam TRoute  A type of the route.
 * @param route  Source route.
 * @param fromEntry  The index of the first entry of the tail.
 *
 * @returns A route starting from the given entry index.
 */
export function routeTail<TRoute extends PathRoute>(route: TRoute, fromEntry: number): TRoute {
  if (fromEntry <= 0 || !route.path.length) {
    return route;
  }

  const path = route.path.slice(fromEntry);

  return {
    ...route,
    path: path,
    dir: !path.length || route.dir,
  };
}
