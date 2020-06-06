/**
 * @packageDocumentation
 * @module @hatsy/route-match
 */
import type { PathEntry } from '../path';
import type { URLRoute } from '../url';
import { decodeURLComponent } from '../url/decode-url.impl';
import { parseURLRoute } from '../url/url-route.impl';

/**
 * A route representing [matrix URL](https://www.w3.org/DesignIssues/MatrixURIs.html).
 */
export interface MatrixRoute extends URLRoute {

  /**
   * A path split onto matrix entries.
   */
  readonly path: readonly MatrixEntry[];

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
  const attrs = new URLSearchParams();

  for (let i = 1; i < parts.length; ++i) {

    const [name, value = ''] = parts[i].split('=');

    attrs.append(decodeURLComponent(name), decodeURLComponent(value));
  }

  return { name: decodeURLComponent(parts[0]), attrs };
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
 * @param url  Source URL.
 *
 * @returns New matrix route instance.
 */
export function matrixRoute(url: URL): MatrixRoute {
  return parseURLRoute(url, parseMatrixEntry, matrixEntryToString);
}