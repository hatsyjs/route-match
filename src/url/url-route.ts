/**
 * @packageDocumentation
 * @module @hatsy/route-match
 */
import type { PathRoute } from '../path';

/**
 * A route representing an URL.
 */
export interface URLRoute<TEntry extends PathRoute.Entry = PathRoute.Entry> extends PathRoute<TEntry> {

  /**
   * URL this route represents.
   *
   * Do not modify it.
   */
  readonly url: URL;

  /**
   * Builds a string representation of this route.
   *
   * @returns URL-encoded pathname without leading `/` with URL search parameters if present.
   */
  toString(): string;

}

/**
 * @internal
 */
function urlRouteToString(this: URLRoute): string {

  const { pathname, searchParams } = this.url;
  const query = searchParams.toString();
  const path = pathname.substring(1); // no leading `/`

  return query ? `${path}?${query}` : path;
}

export function urlRoute(url: URL): URLRoute {

  let { pathname } = url;

  if (pathname.length <= 1) {
    return {
      url,
      path: [],
      dir: true,
      toString: urlRouteToString,
    };
  }

  let dir = false;

  if (pathname.endsWith('/')) {
    dir = true;
    pathname = pathname.substr(1, pathname.length - 2); // Remove leading and trailing slashes
  } else {
    pathname = pathname.substr(1); // Remove leading slash
  }

  return {
    url,
    path: pathname.split('/').map(name => ({ name: decodeURIComponent(name) })),
    dir,
    toString: urlRouteToString,
  };
}
