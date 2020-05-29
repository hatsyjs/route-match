/**
 * @packageDocumentation
 * @module @hatsy/route-match
 */
import type { RouteMatcher } from '../route-matcher';

export const rmatchAnySuffix: RouteMatcher = {
  match: ({ entry: { name } }): RouteMatcher.Match => ({
    spec: [],
    nameChars: name.length,
  }),
};
