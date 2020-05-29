/**
 * @packageDocumentation
 * @module @hatsy/route-match
 */
import type { PathRoute } from '../path';
import type { RouteMatcher } from '../route-matcher';

export function rmatchCapture<
    TEntry extends PathRoute.Entry,
    TRoute extends PathRoute<TEntry>,
    TInput,
    >(
    callback?: (
        this: void,
        match: string,
        context: RouteMatcher.Context<TEntry, TRoute, TInput>,
    ) => void,
): RouteMatcher<TEntry, TRoute, TInput> {
  return {

    test(context): RouteMatcher.Match | undefined {

      const { pattern, matcherIndex } = context;
      const nextMatcher = pattern[matcherIndex + 1];

      if (!nextMatcher || !nextMatcher.find) {
        // This is the last matcher in pattern.
        // Always match.
        return {
          spec: [],
          callback: callback && (() => callback(
              context.entry.name.substring(context.nameOffset, context.entry.name.length),
              context,
          )),
        };
      }

      const found = nextMatcher.find({ ...context, matcherIndex: matcherIndex + 1 });

      if (!found) {
        return;
      }

      const [{ spec, callback: matchCallback }, offset] = found;

      return {
        spec,
        entries: context.route.path.length,
        full: true,
        callback: callback
            ? () => {
              matchCallback();
              callback(
                  context.entry.name.substring(context.nameOffset, offset),
                  context,
              );
            }
            : matchCallback,
      };
    },

  };
}
