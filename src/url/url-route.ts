/**
 * @packageDocumentation
 * @module @hatsy/route-match
 */
import type { PathRoute } from '../path';
import { pathRouteByURL } from '../path';

export interface URLRoute<TEntry extends PathRoute.Entry = PathRoute.Entry> extends PathRoute<TEntry> {

  readonly query: Readonly<Record<string, readonly string[]>>;

  /**
   * Builds a string representation of this route.
   *
   * @returns URL-encoded pathname without leading `/` with URL search parameters if present.
   */
  toString(): string;

}

export function urlRoute(url: URL): URLRoute {

  const urlRoute = pathRouteByURL(url) as PathRoute & { query: Readonly<Record<string, readonly string[]>> };
  const query: Record<string, readonly string[]> = {};

  url.searchParams.forEach((_value, name, parent) => {
    query[name] = parent.getAll(name);
  });

  urlRoute.query = query;
  urlRoute.toString = urlRouteToString(urlRoute.toString);

  return urlRoute;
}

/**
 * @internal
 */
function urlRouteToString(toString: (this: URLRoute) => string): (this: URLRoute) => string {
  return function (this: URLRoute): string {

    let query = '';

    for (const [name, values] of Object.entries(this.query)) {

      const n = encodeURIComponent(name);

      for (const value of values) {
        query += (query ? '&' : '?') + n + '=' + encodeURIComponent(value);
      }
    }

    return toString.call(this) + query;
  };
}
