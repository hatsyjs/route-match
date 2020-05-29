/**
 * @packageDocumentation
 * @module @hatsy/route-match
 */
/**
 * A route representing a path to file or directory.
 */
export interface PathRoute<TEntry extends PathRoute.Entry = PathRoute.Entry> {

  /**
   * A path split onto file and directory entries.
   */
  readonly path: readonly TEntry[];

  /**
   * Whether this is a route to directory.
   */
  readonly dir: boolean;

  /**
   * Builds a string representation of this route.
   *
   * @returns URL-encoded pathname without leading `/`.
   */
  toString(): string;

}

export namespace PathRoute {

  /**
   * Route entry.
   *
   * Represents either file or directory.
   */
  export interface Entry {

    /**
     * Target file or directory name.
     */
    readonly name: string;

  }

}

/**
 * @internal
 */
function pathRouteToString(this: PathRoute): string {

  let out = '';

  for (const { name } of this.path) {
    if (out) {
      out += '/';
    }
    out += encodeURIComponent(name);
  }

  if (this.dir && out) {
    out += '/';
  }

  return out;
}

/**
 * Constructs a path route by the given URL.
 *
 * Each route entry corresponds to directory or file of URL's pathname. Their names are URL-decoded.
 *
 * The path is considered a directory path if the pathname ends with `/`.
 *
 * @param url URL to extract the route from.
 *
 * @returns New route constructed from the given URL's pathname.
 */
export function pathRouteByURL(url: URL): PathRoute {

  let { pathname } = url;

  if (pathname.length <= 1) {
    return {
      path: [],
      dir: true,
      toString: pathRouteToString,
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
    path: pathname.split('/').map(name => ({ name: decodeURIComponent(name) })),
    dir,
    toString: pathRouteToString,
  };
}
