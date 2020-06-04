/**
 * @packageDocumentation
 * @module @hatsy/route-match
 */
import { addPathEntryMatchers } from '../path/path-route-pattern.impl';
import type { RoutePattern } from '../route-match';
import type { RouteMatcher } from '../route-matcher';
import { decodeURLComponent } from '../url/decode-url.impl';
import { parseURLRoutePattern } from '../url/url-route-pattern.impl';
import type { MatrixRoute } from './matrix-route';
import { rmatchMatrixAttr } from './rmatch-matrix-attr';

/**
 * @internal
 */
function addMatrixEntryMatchers(pattern: string, matchers: RouteMatcher<MatrixRoute.Entry, MatrixRoute>[]): void {

  const parts = pattern.split(';');

  addPathEntryMatchers(parts[0], matchers);
  for (let i = 1; i < parts.length; ++i) {

    const [name, value] = parts[i].split('=', 2);

    matchers.push(rmatchMatrixAttr(
        decodeURLComponent(name),
        value ? decodeURLComponent(value) : undefined,
    ));
  }
}

/**
 * Parses matrix route pattern.
 *
 * In addition to {@link urlRoutePattern URL route pattern format} supports the following:
 *
 * - `;name` requires matrix attribute to present.
 *   Corresponds to {@link rmatchMatrixAttr `rmatchMatrixAttr('name')`}.
 *
 * - `;name=value` requires matrix attribute to have the given value.
 *   Corresponds to {@link rmatchMatrixAttr `rmatchMatrixAttr('name', 'value')`}.
 *
 * @param pattern
 */
export function matrixRoutePattern(pattern: string): RoutePattern<MatrixRoute.Entry, MatrixRoute> {
  return parseURLRoutePattern(pattern, addMatrixEntryMatchers);
}
