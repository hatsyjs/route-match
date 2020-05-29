/**
 * @packageDocumentation
 * @module @hatsy/route-match
 */
import { routeMatch } from '../route-match';
import type { RouteMatcher } from '../route-matcher';

export const rmatchDirSep: RouteMatcher = {

  tail: true,

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
      return {
        spec: [],
        entries: 1,
      };
    }
    if (!nameOffset) {
      // The entry name start.
      return { spec: [], nameChars: 0 };
    }
    // In the middle of the entry name.
    return;
  },

  find(context) {

    const { route, entry: { name }, entryIndex, pattern, matcherIndex, input } = context;
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
          input,
        },
    );

    if (!match) {
      return;
    }

    return [match, name.length];
  },

};
