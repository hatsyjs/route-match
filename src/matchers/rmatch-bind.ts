/**
 * @packageDocumentation
 * @module @hatsy/route-match
 */
import type { RouteMatcher } from '../route-matcher';

export function rmatchBind(resultKey?: string): RouteMatcher {
  return {

    test(context): RouteMatcher.Match | undefined {

      const { pattern, matcherIndex } = context;
      const nextMatcher = pattern[matcherIndex + 1];

      if (!nextMatcher || !nextMatcher.find) {
        // This is the last matcher in pattern.
        // Always match.
        return resultKey == null
            ? { spec: [] }
            : {
              spec: [],
              results: {
                [resultKey]: context.entry.name.substring(context.nameOffset, context.entry.name.length),
              },
            };
      }

      const found = nextMatcher.find({ ...context, matcherIndex: matcherIndex + 1 });

      if (!found) {
        return;
      }

      const [match, offset] = found;
      let results: Record<string, any>;

      if (resultKey != null) {
        results = {
          ...match.results,
          [resultKey]: context.entry.name.substring(context.nameOffset, offset),
        };
      } else {
        results = match.results;
      }

      return {
        spec: match.spec,
        entries: context.route.path.length,
        full: true,
        results,
      };
    },

  };
}
