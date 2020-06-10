/**
 * @packageDocumentation
 * @module @hatsy/route-match
 */
import { lazyValue } from '@proc7ts/primitives';
import type { URLEntry, URLRoute } from '../url';
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

}

/**
 * Matrix route entry.
 *
 * Extends file or directory with matrix attributes.
 */
export interface MatrixEntry extends URLEntry {

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
function parseMatrixEntry(raw: string): MatrixEntry {

  const parts = raw.split(';');
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
    raw: raw,
    get attrs() {
      return getAttrs();
    },
  };
}

/**
 * Constructs a matrix route by URL.
 *
 * @param url  Source URL. If string given, then URL will be constructed relatively to `route:/` base.
 *
 * @returns New matrix route instance.
 */
export function matrixRoute(url: URL | string): MatrixRoute {
  return parseURLRoute(url, parseMatrixEntry);
}
