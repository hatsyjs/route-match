/**
 * @packageDocumentation
 * @module @hatsy/route-match
 */
import { lazyValue } from '@proc7ts/primitives';
import type { PathEntry } from '../path';
import type { URLRoute } from '../url';
import { parseURLRoute } from '../url/url-route.impl';
import { decodeURLComponent } from '../url/url.impl';

/**
 * A route representing [matrix URL](https://www.w3.org/DesignIssues/MatrixURIs.html).
 */
export interface MatrixRoute extends URLRoute {

  /**
   * A path split onto matrix entries.
   */
  readonly path: readonly MatrixEntry[];

  segment(from: number, to?: number): MatrixRoute;

}

/**
 * Matrix route entry.
 *
 * Extends file or directory with matrix attributes.
 */
export interface MatrixEntry extends PathEntry {

  /**
   * Matrix attributes represented by URL search parameters.
   *
   * Intended to be immutable.
   */
  readonly attrs: URLSearchParams;

}

/**
 * @internal
 */
function parseMatrixEntry(string: string): MatrixEntry {

  const parts = string.split(';');
  const getAttrs = lazyValue(() => {

    const attrs = new URLSearchParams();

    for (let i = 1; i < parts.length; ++i) {

      const [name, value = ''] = parts[i].split('=');

      attrs.append(decodeURLComponent(name), decodeURLComponent(value));
    }

    return attrs;
  });

  return {
    name: decodeURLComponent(parts[0]),
    get attrs() {
      return getAttrs();
    },
  };
}

/**
 * @internal
 */
function matrixEntryToString({ name, attrs }: MatrixEntry): string {

  let result = encodeURIComponent(name);

  attrs.forEach((value, name) => {
    result += `;${(encodeURIComponent(name))}=${encodeURIComponent(value)}`;
  });

  return result;
}

/**
 * Constructs a matrix route by URL.
 *
 * @param url  Source URL. If string given, then URL will be constructed relatively to `route:/` base.
 *
 * @returns New matrix route instance.
 */
export function matrixRoute(url: URL | string): MatrixRoute {
  return parseURLRoute(url, parseMatrixEntry, matrixEntryToString);
}
