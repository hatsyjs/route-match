import { itsReduction } from '@proc7ts/a-iterable';
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
    entryToString: (entry: TEntry) => string,
): ParsedURLRoute<TEntry> {

  let { pathname } = url;

  if (pathname.length <= 1) {
    return {
      url,
      path: [],
      dir: true,
      toString: urlRouteToString(entryToString),
    };
  }

  let dir = false;
  const from = (pathname.length > 1 && pathname.startsWith('/')) ? 1 : 0;

  if (pathname.endsWith('/')) {
    dir = true;
    pathname = pathname.substring(from, pathname.length - 1); // Remove leading and trailing slashes
  } else {
    pathname = pathname.substr(from); // Remove leading slash
  }

  return {
    url,
    path: pathname.split('/').map(parseEntry),
    dir,
    toString: urlRouteToString(entryToString),
  };
}

/**
 * @internal
 */
function urlRouteToString<TEntry extends PathEntry>(
    entryToString: (entry: TEntry) => string,
): (this: ParsedURLRoute<TEntry>) => string {
  return function (this: ParsedURLRoute<TEntry>): string {

    const { searchParams } = this.url;
    const query = searchParams.toString();
    let path = itsReduction(
        this.path,
        (prev, entry) => prev ? `${prev}/${entryToString(entry)}` : entryToString(entry),
        '',
    );

    if (path && this.dir) {
      path += '/';
    }

    return query ? `${path}?${query}` : path;
  };
}
