/**
 * @packageDocumentation
 * @module @hatsy/route-match
 */
import { valueProvider } from '@proc7ts/primitives';
import { routeMatch } from '../route-match';
import type { RouteMatcher } from '../route-matcher';

/**
 * Route matcher that matches directory separator.
 *
 * This matcher should be the last one of the matchers applicable to the same entry.
 *
 * Does not match in the middle of the entry name.
 *
 * When matches at the end of the entry name, moves to the next entry.
 */
export const rmatchDirSep: RouteMatcher = {

  test({
    route,
    entry: { name },
    entryIndex,
    nameOffset,
  }): RouteMatcher.Match | undefined {
    if (nameOffset >= name.length) {
      // The end of entry name.
      // Move to the next entry.
      if (entryIndex + 1 >= route.path.length && !route.dir) {
        // Unless current entry is the last one and it is not a directory
        return;
      }
      return { entries: 1 };
    }
    if (!nameOffset) {
      // The entry name start.
      return { nameChars: 0 };
    }
    // In the middle of the entry name.
    return;
  },

  find(context) {

    const { route, entry: { name }, entryIndex, pattern, matcherIndex } = context;
    const fromEntry = entryIndex + 1;

    if (!route.dir && fromEntry >= route.path.length) {
      return;
    }

    const match = routeMatch(
        route,
        pattern,
        {
          fromEntry,
          fromMatcher: matcherIndex + 1,
        },
    );

    if (!match) {
      return;
    }

    return [match, name.length];
  },

  tail: valueProvider(true),

};
