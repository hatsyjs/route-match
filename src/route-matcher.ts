/**
 * @packageDocumentation
 * @module @hatsy/route-match
 */
import type { PathRoute } from './path';
import type { RouteMatch, RoutePattern } from './route-match';

/**
 * Route fragment matcher.
 *
 * @typeparam TEntry  A type of supported route entries.
 * @typeparam TRoute  A type of supported route.
 * @typeparam TInput  A type of supported route match input.
 */
export interface RouteMatcher<
    TEntry extends PathRoute.Entry = PathRoute.Entry,
    TRoute extends PathRoute<TEntry> = PathRoute<TEntry>,
    TInput = undefined,
    > {

  /**
   * Whether this matcher still matches after the end of the route.
   */
  readonly tail?: boolean;

  /**
   * Tests whether a fragment of the route satisfying this matcher's conditions.
   *
   * @param context  Route matching context.
   *
   * @returns {@link RouteMatcher.Match Route match} instance specifying a matching route fragment,
   * or `false`/`null`/`undefined` otherwise.
   */
  test(
      context: RouteMatcher.Context<TEntry, TRoute, TInput>,
  ): RouteMatcher.Match | false | null | undefined;

  /**
   * Searches for the fragment of the route satisfying this matcher's conditions.
   *
   * In contrast to the [[test]] method this one attempts to find the matching fragment starting at some offset from
   * current position specified by `context`, and then tries to match the remaining path against the remaining pattern.
   *
   * The matching route fragment always starts within current route entry.
   *
   * @param context  Route matching context.
   *
   * @returns A tuple containing a {@link RouteMatch match} of the remaining path against the remaining pattern and
   * an offset within current entry name the matching route fragment starts at, or `false`/`null`/`undefined` if match
   * not found.
   */
  find?(
      context: RouteMatcher.Context<TEntry, TRoute, TInput>,
  ): readonly [RouteMatch, number] | false | null | undefined;

}

export namespace RouteMatcher {

  /**
   * Route match context.
   *
   * This is passed to {@link RouteMatcher route matcher} to indicate the position inside the route the match should be
   * searched at.
   *
   * @typeparam TEntry  A type of tested route entries.
   * @typeparam TRoute  A type of tested route.
   * @typeparam TInput  A type of route match input.
   */
  export interface Context<
      TEntry extends PathRoute.Entry,
      TRoute extends PathRoute<TEntry>,
      TInput,
      > {

    /**
     * Route path.
     */
    readonly route: TRoute;

    /**
     * The first entry the matcher should match against.
     */
    readonly entry: TEntry;

    /**
     * The index of the {@link entry first entry} within the {@link route route path} the matcher should match against.
     */
    readonly entryIndex: number;

    /**
     * An offset of the first character within {@link entry first entry} name the matcher should match against.
     */
    readonly nameOffset: number;

    /**
     * Route pattern the matcher belongs to.
     */
    readonly pattern: RoutePattern<TEntry, TRoute, TInput>;

    /**
     * The index of the matcher in the route pattern.
     */
    readonly matcherIndex: number;

    /**
     * Route match {@link RouteMatch.InputOptions.input input} passed to [[routeMatch]] function.
     */
    readonly input: TInput;

  }

  /**
   * Route match.
   *
   * This is returned from {@link RouteMatch route matcher} and indicates the matching part of the route.
   */
  export interface Match {

    /**
     * The number of fully matching route entries.
     *
     * When set, this value increases the index of the {@link Context.entryIndex route entry} to apply subsequent
     * matchers to.
     *
     * @default `0`, which means the subsequent matcher will be applied to {@link Context.entry current entry}.
     * @see [[nameChars]]
     */
    readonly entries?: number;

    /**
     * The number of matching characters in the name of current route entry.
     *
     * This value increases the {@link Context.nameOffset offset in the name} of the route entry to apply subsequent
     * matchers to. If the resulting offset is equal or greater than the length of the name, then the next matcher will
     * be applied to the same route entry. If that fails, the next entry will be used, while the offset will be set to
     * zero.
     *
     * @default The length of current entry name, unless [[entries]] set to non-zero value, in which case it defaults
     * to zero.
     */
    readonly nameChars?: number;

    /**
     * Whether this is a full match of the route against the pattern.
     */
    readonly full?: boolean;

    /**
     * A callback function that will be called by the {@link RouteMatch.callback final match callback}.
     */
    readonly callback?: () => void;

  }

}
