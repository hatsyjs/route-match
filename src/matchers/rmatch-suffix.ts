/**
 * @packageDocumentation
 * @module @hatsy/route-match
 */
import type { RouteMatcher } from '../route-matcher';

export const rmatchSuffix: RouteMatcher = ({ entry: { name } }): RouteMatcher.Match => ({
  spec: [],
  nameChars: name.length,
});
