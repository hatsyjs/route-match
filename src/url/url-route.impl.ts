import type { URLEntry, URLRoute } from './url-route';

/**
 * @internal
 */
export interface ParsedURLRoute<TEntry extends URLEntry> extends URLRoute {

  readonly path: readonly TEntry[];

}

/**
 * @internal
 */
export function parseURLRoute<TEntry extends URLEntry>(
    url: URL | string,
    parseEntry: (name: string) => TEntry,
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
      section: urlRouteSection,
      toString: urlRouteToString,
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
    section: urlRouteSection,
    toString: urlRouteToString,
  };
}

/**
 * @internal
 */
export function urlRouteSection<TEntry extends URLEntry, TRoute extends ParsedURLRoute<TEntry>>(
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
  const pathname = urlRouteSectionToString(this, from, to);
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
}

/**
 * @internal
 */
function urlRouteSectionToString<TRoute extends URLRoute>(
    { path, dir }: TRoute,
    fromEntry: number,
    toEntry: number,
): string {
  if (fromEntry >= toEntry) {
    return '';
  }

  let out = '';

  for (let i = fromEntry; i < toEntry; ++i) {

    const entry = path[i];

    if (out) {
      out += '/';
    }
    out += entry.raw;
  }
  if (out && dir || toEntry < path.length) {
    out += '/';
  }

  return out;
}

/**
 * @internal
 */
function urlRouteToString<TEntry extends URLEntry>(this: ParsedURLRoute<TEntry>): string {

  const { searchParams } = this.url;
  const query = searchParams.toString();
  const path = urlRouteSectionToString(this, 0, this.path.length);

  return query ? `${path}?${query}` : path;
}
