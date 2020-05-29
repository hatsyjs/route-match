import type { RouteMatcher } from '../route-matcher';

export const rmatchAny: RouteMatcher<any, any> = {

  tail: true,

  test(context): RouteMatcher.Match | undefined {

    const { pattern, matcherIndex } = context;
    const nextMatcher = pattern[matcherIndex + 1];

    if (!nextMatcher || !nextMatcher.find) {
      // This is the last matcher in pattern.
      // Always match.
      return { spec: [] };
    }

    const found = nextMatcher.find({ ...context, matcherIndex: matcherIndex + 1 });

    if (!found) {
      return;
    }

    const [match] = found;

    return {
      spec: match.spec,
      entries: context.route.path.length,
      full: true,
    };
  },

};
