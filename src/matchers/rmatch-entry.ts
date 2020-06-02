/**
 * @packageDocumentation
 * @module @hatsy/route-match
 */
import type { RouteMatcher } from '../route-matcher';

/**
 * Builds a route matcher that matches any entry and captures its name.
 *
 * Matches only at the {@link RouteMatcher.Context.nameOffset entry name beginning}.
 *
 * @param name  The name of the entry to capture.
 */
export function rmatchEntry(name: string): RouteMatcher {
  return {
    test: context => !context.nameOffset && {
      callback(capture) {
        capture('capture', name, context.entry.name, context);
      },
    },
  };
}
