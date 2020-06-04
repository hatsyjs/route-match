/**
 * @packageDocumentation
 * @module @hatsy/route-match
 */
import type { PathRoute } from '../path';
import type { URLRoute } from '../url';
import { decodeURLComponent } from '../url/decode-url.impl';
import { parseURLRoute } from '../url/url-route.impl';

/**
 * A route representing [matrix URL](https://www.w3.org/DesignIssues/MatrixURIs.html).
 */
export type MatrixRoute<TEntry extends MatrixRoute.Entry = MatrixRoute.Entry> = URLRoute<TEntry>;

export namespace MatrixRoute {

  /**
   * Matrix route entry.
   *
   * Extends file or directory with matrix attributes.
   */
  export interface Entry extends PathRoute.Entry {

    /**
     * Matrix attributes represented by URL search parameters.
     */
    readonly attrs: URLSearchParams;

  }

}

/**
 * @internal
 */
function matrixRouteEntry(string: string): MatrixRoute.Entry {

  const parts = string.split(';');
  const attrs = new URLSearchParams();

  for (let i = 1; i < parts.length; ++i) {

    const [name, value = ''] = parts[i].split('=');

    attrs.append(decodeURLComponent(name), decodeURLComponent(value));
  }

  return { name: decodeURLComponent(parts[0]), attrs };
}

/**
 * Constructs a matrix route by URL.
 *
 * @param url  Source URL.
 *
 * @returns New matrix route instance.
 */
export function matrixRoute(url: URL): MatrixRoute {
  return parseURLRoute(url, matrixRouteEntry);
}
