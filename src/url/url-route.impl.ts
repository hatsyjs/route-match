import type { PathEntry } from '../path';
import type { URLRoute } from './url-route';

/**
 * @internal
 */
export interface ParsedURLRoute<TEntry extends PathEntry> extends URLRoute {

  readonly path: readonly TEntry[];

  segment(from: number, to?: number): ParsedURLRoute<TEntry>;

}

/**
 * @internal
 */
export function parseURLRoute<TEntry extends PathEntry>(
    url: URL | string,
    parseEntry: (name: string) => TEntry,
    entryToString: (entry: TEntry) => string,
): ParsedURLRoute<TEntry> {
  if (typeof url === 'string') {
    url = new URL(url, 'route:/');
  }

  let { pathname } = url;

  if (pathname.length <= 1) {
    return {
      url,
      path: [],
      dir: true,
      segment: urlRouteSegment(entryToString),
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
    segment: urlRouteSegment(entryToString),
    toString: urlRouteToString(entryToString),
  };
}

/**
 * @internal
 */
export function urlRouteSegment<TEntry extends PathEntry, TRoute extends ParsedURLRoute<TEntry>>(
    entryToString: (entry: TEntry) => string,
): (this: TRoute, from: number, to?: number) => TRoute {
  return function (
      this: TRoute,
      from: number,
      to: number = this.path.length,
  ): TRoute {
    if (from < 0) {
      from = 0;
    }

    let tillEnd = false;

    if (to < from) {
      to = from;
    }
    if (to >= this.path.length) {
      if (!from) {
        return this;
      }
      to = this.path.length;
      tillEnd = true;
    }

    const path = this.path.slice(from, to);
    const pathname = urlRouteSegmentToString(this, entryToString, from, to);
    let url: URL;

    if (from) {
      url = new URL(pathname, 'route:/');
      if (tillEnd) {
        url = new URL(`?${this.url.searchParams}`, url);
      }
    } else {
      url = new URL(`/${pathname}`, this.url);
    }

    return {
      ...this,
      url,
      path,
      dir: this.dir || !tillEnd || !path.length,
    };
  };
}

/**
 * @internal
 */
function urlRouteSegmentToString<TRoute extends URLRoute>(
    { path, dir }: TRoute,
    entryToString: (entry: TRoute['path'][0]) => string,
    from: number,
    to: number,
): string {
  if (from >= to) {
    return '';
  }

  let out = '';

  for (let i = from; i < to; ++i) {

    const entry = path[i];

    if (out) {
      out += '/';
    }
    out += entryToString(entry);
  }
  if (out && dir || to < path.length) {
    out += '/';
  }

  return out;
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
    const path = urlRouteSegmentToString(this, entryToString, 0, this.path.length);

    return query ? `${path}?${query}` : path;
  };
}
