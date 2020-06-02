/**
 * @packageDocumentation
 * @module @hatsy/route-match
 */
import { routeMatch } from '../route-match';
import type { RouteMatcher } from '../route-matcher';

export function rmatchDirs(name?: string): RouteMatcher {
  return {

    tail: true,

    test(context): RouteMatcher.Match | undefined {

      const { route, nameOffset, pattern, matcherIndex } = context;

      if (nameOffset) {
        // Not applicable in the middle of entry name.
        return;
      }

      const { path } = route;
      const fromMatcher = matcherIndex + 1;

      if (fromMatcher >= pattern.length) {

        // This is the last matcher in pattern.
        // Always match.
        return name != null
            ? {
              full: true,
              callback: capture => capture(
                  'dirs',
                  name,
                  path.length,
                  context,
              ),
            }
            : { full: true };
      }

      const { entryIndex } = context;
      let fromEntry = entryIndex;

      // Find the next entry matching the rest of the pattern.
      while (fromEntry <= path.length) {

        const match = routeMatch(route, pattern, { fromEntry, fromMatcher });

        if (match) {
          return {
            entries: context.route.path.length,
            full: true,
            callback: name != null && fromEntry > entryIndex // There is something to capture
                ? capture => {
                  match(capture);
                  capture(
                      'dirs',
                      name,
                      fromEntry,
                      context,
                  );
                }
                : match,
          };
        }

        ++fromEntry;
      }

      return;
    },

  };
}
