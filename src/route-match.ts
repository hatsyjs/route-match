/**
 * @packageDocumentation
 * @module @hatsy/route-match
 */
import type { PathRoute } from './path-route';
import type { RouteMatcher } from './route-matcher';

/**
 * A successful {@link routeMatch match of the route} against {@link RoutePattern pattern}.
 *
 * @typeparam TEntry  A type of matching route entries.
 * @typeparam TRoute  A type of matching route path.
 */
export interface RouteMatch<TEntry extends PathRoute.Entry, TRoute extends PathRoute<TEntry>> {

  /**
   * The final specificity of this match.
   *
   * Each weight is a sum of weights with the same priority specified by each matcher.
   */
  readonly spec: RouteMatch.Specificity;

  /**
   * The final results map bound to this match by all matchers.
   */
  readonly results: RouteMatch.Results;

}

/**
 * A pattern to {@link routeMatch match the route} against.
 *
 * This is an array of {@link RouteMatch matchers}.
 *
 * @typeparam TEntry  A type of supported route entries.
 * @typeparam TRoute  A type of supported route path.
 */
export type RoutePattern<
    TEntry extends PathRoute.Entry,
    TRoute extends PathRoute<TEntry> = PathRoute<TEntry>,
    > = readonly RouteMatcher<TEntry, TRoute>[];

export namespace RouteMatch {

  /**
   * A specificity of the route match.
   *
   * This is an array of weight values. The less the index of the weight element the higher priority it has.
   */
  export type Specificity = readonly number[];

  /**
   * A map of match results.
   *
   * Contains named values bound by matchers.
   */
  export interface Results {

    readonly [name: string]: any;

  }

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
 * @internal
 */
const defaultRouteMatchSpecificity: RouteMatch.Specificity = [1];

/**
 * Performs a match of the given pattern against the given route.
 *
 * Tries to match fragments of the given route by each of the pattern matchers, in order. If some matcher fails, the
 * match fails too. If all matchers succeed, the match result is constructed and returned.
 *
 * @param route  Target route to match against.
 * @param pattern  A pattern to match.
 * @param options  Route match options.
 *
 * @returns  Either successful route match object, or `null` if the route does not match the given pattern.
 */
export function routeMatch<TEntry extends PathRoute.Entry, TRoute extends PathRoute<TEntry>>(
    this: void,
    route: TRoute,
    pattern: RoutePattern<TEntry, TRoute>,
    options: RouteMatch.Options = {},
): RouteMatch<TEntry, TRoute> | null {

  const { path } = route;
  const finalSpec: number[] = [];
  const finalResult: Record<string, any> = {};
  let { fromEntry: entryIndex = 0, nameOffset = 0, fromMatcher: matcherIndex = 0 } = options;

  while (entryIndex < path.length) {

    const entry = path[entryIndex];
    const matcher = pattern[matcherIndex];

    if (!matcher) {
      return null; // No more matchers
    }

    nameOffset = Math.max(0, nameOffset);

    let match = matcher({
      route,
      entry,
      entryIndex,
      nameOffset,
      pattern,
      matcherIndex,
    });

    if (!match) {
      // No match
      if (nameOffset >= entry.name.length) {
        // ...but the name is fully consumed. Try the next route entry against the same matcher.
        nameOffset = 0;
        ++entryIndex;
        continue;
      }
      return null;
    }

    if (match === true) {
      // Do not move to next route entry.
      // Consume the name of current one instead, and try the next matcher on it.
      match = { nameChars: entry.name.length };
    }

    const { spec = defaultRouteMatchSpecificity, entries, nameChars = 0, results } = match;

    if (entries) {
      // Some entries matched.
      entryIndex += entries;
      // Some chars of the last matching entry name matched.
      nameOffset = nameChars;
    } else {
      // Some chars of the current entry name matched.
      nameOffset += nameChars;
    }

    if (matcherIndex === pattern.length - 1 && nameOffset >= entry.name.length) {
      // The last matcher.
      // Move to next route entry if the name of matching one is fully consumed.
      nameOffset = 0;
      ++entryIndex;
    }

    // Apply the match result.
    if (results) {
      Object.assign(finalResult, results);
    }

    // Adjust the specificity.
    spec.forEach((s, i) => {
      finalSpec[i] = (finalSpec[i] || 0) + s;
    });

    // Move to next matcher.
    ++matcherIndex;
  }

  if (matcherIndex < pattern.length) {
    return null; // Non-matching matchers left.
  }

  return {
    spec: finalSpec,
    results: finalResult,
  };
}
