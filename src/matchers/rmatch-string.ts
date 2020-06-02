/**
 * @packageDocumentation
 * @module @hatsy/route-match
 */
import type { RouteMatch } from '../route-match';
import { routeMatch } from '../route-match';
import type { RouteMatcher } from '../route-matcher';

export function rmatchString(expected: string): RouteMatcher {
  return {

    test({ entry: { name }, nameOffset }): RouteMatcher.Match | false {
      return name.substr(nameOffset, expected.length) === expected && {
        nameChars: expected.length,
      };
    },

    find({
      route,
      entry: { name },
      entryIndex,
      nameOffset,
      pattern,
      matcherIndex,
    }): readonly [RouteMatch, number] | null | undefined {

      const start = name.indexOf(expected, nameOffset);

      if (start < 0) {
        return;
      }

      const match = routeMatch(
          route,
          pattern,
          {
            fromEntry: entryIndex,
            nameOffset: start + expected.length,
            fromMatcher: matcherIndex + 1,
          },
      );

      if (!match) {
        return;
      }

      return [match, start];
    },

  };
}
