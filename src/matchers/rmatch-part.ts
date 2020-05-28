/**
 * @packageDocumentation
 * @module @hatsy/route-match
 */
import type { RouteMatcher } from '../route-matcher';

export function rmatchPart(namePart: string): RouteMatcher {
  return ({
    entry,
    nameOffset,
  }) => entry.name.substr(nameOffset, namePart.length) === namePart && {
    spec: [1, 0],
    nameChars: namePart.length,
  };
}
