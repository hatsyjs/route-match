/**
 * @packageDocumentation
 * @module @hatsy/route-match
 */
import type { RouteMatcher } from '../route-matcher';

export function rmatchName(expected: string): RouteMatcher {
  return {
    test: ({ entry, nameOffset }) => !nameOffset && entry.name === expected && {},
  };
}
