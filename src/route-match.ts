/**
 * @packageDocumentation
 * @module @hatsy/route-match
 */
import type { PathRoute } from './path';
import type { RouteCaptor } from './route-captor';
import type { RouteMatcher } from './route-matcher';

/**
 * A successful {@link routeMatch match of the route} against {@link RoutePattern pattern}.
 *
 * This is a function that reports registered partial matches via {@link RouteCaptor route capture receiver}.
 *
 * @typeParam TRoute  A type of matching route.
 */
export type RouteMatch<TRoute extends PathRoute = PathRoute> =
/**
 * @param capture - A {@link RouteCaptor route capture receiver} function to report partial matches to.
 */
    (
        this: void,
        captor: RouteCaptor<TRoute>,
    ) => void;

/**
 * A pattern to {@link routeMatch match the route} against.
 *
 * This is an array of {@link RouteMatch matchers}.
 *
 * @typeParam TRoute  A type of supported route.
 */
export type RoutePattern<TRoute extends PathRoute = PathRoute> = readonly RouteMatcher<TRoute>[];

export namespace RouteMatch {

  /**
   * Route match options.
   */
  export interface Options {

    /**
     * The index of the {@link entry first entry} within the route path to match.
     *
     * @default `0`
     */
    readonly fromEntry?: number;

    /**
     * An offset of the first character within {@link fromEntry first entry} name to match.
     *
     * @default `0`
     */
    readonly nameOffset?: number;

    /**
     * The index of the first matcher in the route pattern to match against.
     *
     * @default `0`
     */
    readonly fromMatcher?: number;

  }

}

/**
 * Performs a match of the given pattern against the given route.
 *
 * Tries to match fragments of the given route by each of the pattern matchers, in order. If some matcher fails, the
 * match fails too. If all matchers succeed, the match result is constructed and returned.
 *
 * @typeParam TRoute  A type of route to match against.
 * @param route - Target route to match against.
 * @param pattern - A pattern to match.
 * @param options - Route match options.
 *
 * @returns  Either successful route match object, or `null` if the route does not match the given pattern.
 */
export function routeMatch<TRoute extends PathRoute>(
    this: void,
    route: TRoute,
    pattern: RoutePattern<TRoute>,
    options: RouteMatch.Options = {},
): RouteMatch<TRoute> | null {

  const { path } = route;
  let successfulMatch: RouteMatch<TRoute> = () => {/* nothing captured */};
  let { fromEntry: entryIndex = 0, nameOffset = 0, fromMatcher: matcherIndex = 0 } = options;

  while (entryIndex < path.length) {

    const entry = path[entryIndex];
    const { name } = entry;
    const matcher = pattern[matcherIndex];

    if (!matcher) {
      // No more matchers
      if (nameOffset < name.length) {
        return null;
      }

      // The name of current entry is fully matched.
      // Move to the next entry.
      nameOffset = 0;
      ++entryIndex;

      continue;
    }

    nameOffset = Math.max(0, nameOffset);

    const match = matcher.test({
      route,
      entry,
      entryIndex,
      nameOffset,
      pattern,
      matcherIndex,
    });

    if (!match) {
      return null; // No match.
    }

    const {
      entries,
      nameChars = entries ? 0 : name.length,
      callback,
      full,
    } = match;

    if (entries) {
      // Some entries matched.
      entryIndex += entries;
      // Some chars of the last matching entry name matched.
      nameOffset = nameChars;
    } else {
      // Some chars of the current entry name matched.
      nameOffset += nameChars;
    }

    // Register a capture callback.
    if (callback) {

      const prevMatch = successfulMatch;

      successfulMatch = captor => {
        prevMatch(captor);
        callback(captor);
      };
    }

    if (full) {
      // Full match.
      // Further match is not needed.
      matcherIndex = pattern.length;
      break;
    }

    // Move to next matcher.
    ++matcherIndex;
  }

  while (matcherIndex < pattern.length) {
    // Non-matching matchers left.
    // Require them all to match after the end.
    const matcher = pattern[matcherIndex];

    if (!matcher.tail || !matcher.tail({
      route,
      entryIndex: path.length,
      nameOffset: 0,
      pattern,
      matcherIndex,
    })) {
      return null;
    }

    ++matcherIndex;
  }

  return captor => {

    let keySeq = 0;

    successfulMatch((kind, key, ...capture) => {
      if (typeof key === 'number') { // May be any number. E.g. when reporting nested matches
        key = ++keySeq;
      }
      captor(kind, key, ...capture);
    });
  };
}
