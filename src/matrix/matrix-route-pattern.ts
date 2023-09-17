import { decodeURISearchPart } from 'httongue';
import { addPathEntryMatchers } from '../path/path-route-pattern.impl.js';
import type { RoutePattern } from '../route-match.js';
import type { RouteMatcher } from '../route-matcher.js';
import { parseURLRoutePattern } from '../url/url-route-pattern.impl.js';
import type { MatrixRoute } from './matrix-route.js';
import { rmatchMatrixAttr } from './rmatch-matrix-attr.js';

/**
 * @internal
 */
function addMatrixEntryMatchers(pattern: string, matchers: RouteMatcher<MatrixRoute>[]): void {
  const parts = pattern.split(';');

  addPathEntryMatchers(parts[0], matchers);
  for (let i = 1; i < parts.length; ++i) {
    const [name, value] = parts[i].split('=', 2);

    matchers.push(
      rmatchMatrixAttr(decodeURISearchPart(name), value ? decodeURISearchPart(value) : undefined),
    );
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
export function matrixRoutePattern(pattern: string): RoutePattern<MatrixRoute> {
  return parseURLRoutePattern(pattern, addMatrixEntryMatchers);
}
