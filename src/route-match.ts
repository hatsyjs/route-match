/**
 * @packageDocumentation
 * @module @hatsy/route-match
 */
import type { PathRoute } from './path';
import type { RouteMatcher } from './route-matcher';

/**
 * A successful {@link routeMatch match of the route} against {@link RoutePattern pattern}.
 */
export interface RouteMatch {

  /**
   * A function that calls all callbacks of all {@link RouteMatcher.Match.callback matches}.
   */
  readonly callback: (this: void) => void;

}

/**
 * A pattern to {@link routeMatch match the route} against.
 *
 * This is an array of {@link RouteMatch matchers}.
 *
 * @typeparam TEntry  A type of supported route entries.
 * @typeparam TRoute  A type of supported route.
 * @typeparam TInput  A type of supported route match input.
 */
export type RoutePattern<
    TEntry extends PathRoute.Entry = PathRoute.Entry,
    TRoute extends PathRoute<TEntry> = PathRoute<TEntry>,
    TInput = undefined,
    > = readonly RouteMatcher<TEntry, TRoute, TInput>[];

export namespace RouteMatch {

  /**
   * Route match options without input.
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

  /**
   * Route match options supporting input.
   *
   * @typeparam TInput  A type of route match input.
   */
  export interface InputOptions<TInput> extends Options {

    /**
     * Route match input.
     */
    readonly input: TInput;

  }

}

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
    options?: RouteMatch.Options,
): RouteMatch | null;

/**
 * Performs a match of the given pattern against the given route with the given input input.
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
export function routeMatch<
    TEntry extends PathRoute.Entry,
    TRoute extends PathRoute<TEntry>,
    TInput,
    >(
    this: void,
    route: TRoute,
    pattern: RoutePattern<TEntry, TRoute>,
    options: RouteMatch.InputOptions<TInput>,
): RouteMatch | null;

export function routeMatch<
    TEntry extends PathRoute.Entry,
    TRoute extends PathRoute<TEntry>,
    TInput,
    >(
    this: void,
    route: TRoute,
    pattern: RoutePattern<TEntry, TRoute, TInput>,
    options: RouteMatch.Options | RouteMatch.InputOptions<TInput> = {} as RouteMatch.InputOptions<TInput>,
): RouteMatch | null {

  const { path } = route;
  const { input } = options as RouteMatch.InputOptions<TInput>;
  let finalCallback: () => void = () => {/* empty callback */};
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
      input,
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

    // Apply the match result.
    if (callback) {

      const prevCallback = finalCallback;

      finalCallback = () => {
        prevCallback();
        callback();
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
    if (!pattern[matcherIndex++].tail) {
      return null;
    }
  }

  return {
    callback: finalCallback,
  };
}
