/**
 * @packageDocumentation
 * @module @hatsy/route-match
 */
import { valueProvider } from '@proc7ts/primitives';
import { routeMatch } from '../route-match';
import type { RouteMatcher } from '../route-matcher';

/**
 * Builds a route matcher that matches any number of directories, and captures them.
 *
 * Matches only at the {@link RouteMatcher.Context.nameOffset entry name beginning}.
 *
 * Reports the capture as {@link RouteCaptureSignatureMap.dirs `dirs`}.
 *
 * Never captures empty match.
 *
 * @param name  The name of the capture or nothing to not capture.
 * @returns  New route matcher.
 *
 * @see Use {@link rmatchAnyDirs} if the capturing is not needed.
 */
export function rcaptureDirs(name?: string): RouteMatcher {
  return {

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
                  capture(
                      'dirs',
                      name,
                      fromEntry,
                      context,
                  );
                  match(capture);
                }
                : match,
          };
        }

        ++fromEntry;
      }

      return;
    },

    tail: valueProvider(true),

  };
}
