import type { RouteMatcher } from '../route-matcher';
import type { MatrixRoute } from './matrix-route';

/**
 * Builds matrix route matcher that matches a matrix attribute.
 *
 * @param name - Required matrix attribute.
 * @param value - A value the attribute should have. Or nothing to just require the attribute to present.
 *
 * @returns New URL route matcher.
 */
export function rmatchMatrixAttr(name: string, value?: string): RouteMatcher<MatrixRoute> {
  const condition: (attrs: URLSearchParams) => boolean =
    value == null ? attrs => attrs.has(name) : attrs => attrs.getAll(name).includes(value);

  return {
    test: ({ entry: { attrs } }) => condition(attrs) && { nameChars: 0 },
  };
}
