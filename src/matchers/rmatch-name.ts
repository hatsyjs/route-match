import type { RouteMatcher } from '../route-matcher';

/**
 * Builds a route matcher that matches the entry with the given name.
 *
 * Matches only at the {@link RouteMatcher.Context.nameOffset entry name beginning}.
 *
 * @param expected - Expected entry name.
 * @returns New route matcher.
 */
export function rmatchName(expected: string): RouteMatcher {
  return {
    test: ({ entry, nameOffset }) => !nameOffset && entry.name === expected && {},
  };
}
