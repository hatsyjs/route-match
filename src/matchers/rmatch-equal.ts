/**
 * @packageDocumentation
 * @module @hatsy/route-match
 */
import type { RouteMatcher } from '../route-matcher';

export function rmatchEqual(name: string): RouteMatcher {
  return {
    match: ({ entry }) => entry.name === name,
  };
}
