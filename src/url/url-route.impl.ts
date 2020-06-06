import type { PathEntry } from '../path';
import type { URLRoute } from './url-route';

/**
 * @internal
 */
export interface ParsedURLRoute<TEntry extends PathEntry> extends URLRoute {

  readonly path: readonly TEntry[]

}

/**
 * @internal
 */
export function parseURLRoute<TEntry extends PathEntry>(
    url: URL,
    parseEntry: (name: string) => TEntry,
): ParsedURLRoute<TEntry> {

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
    path: pathname.split('/').map(parseEntry),
    dir,
    toString: urlRouteToString,
  };
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
