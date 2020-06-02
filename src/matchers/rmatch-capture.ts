/**
 * @packageDocumentation
 * @module @hatsy/route-match
 */
import type { RouteMatcher } from '../route-matcher';

export function rmatchCapture(name?: string): RouteMatcher {
  return {

    test(context): RouteMatcher.Match | undefined {

      const { pattern, matcherIndex } = context;
      const nextMatcher = pattern[matcherIndex + 1];

      if (!nextMatcher || !nextMatcher.find) {
        // This is the last matcher in pattern.
        // Always match.
        return name != null
            ? {
              callback: capture => capture(
                  'capture',
                  name,
                  context.entry.name.substring(context.nameOffset, context.entry.name.length),
                  context,
              ),
            }
            : {};
      }

      const found = nextMatcher.find({ ...context, matcherIndex: matcherIndex + 1 });

      if (!found) {
        return;
      }

      const { nameOffset } = context;
      const [match, offset] = found;

      return {
        entries: context.route.path.length,
        full: true,
        callback: name != null && offset > nameOffset
            ? capture => {
              capture(
                  'capture',
                  name,
                  context.entry.name.substring(nameOffset, offset),
                  context,
              );
              match(capture);
            }
            : match,
      };
    },

  };
}
