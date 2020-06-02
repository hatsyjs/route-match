import { valueProvider } from '@proc7ts/primitives';
import type { RouteMatcher } from '../route-matcher';

/**
 * Route matcher that matches any route entry.
 */
export const rmatchAnyEntry: RouteMatcher = {
  test: (/*#__PURE__*/ valueProvider({})),
};
