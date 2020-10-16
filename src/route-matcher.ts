/**
 * @packageDocumentation
 * @module @hatsy/route-match
 */
import type { PathRoute } from './path';
import type { RouteMatch, RoutePattern } from './route-match';

/**
 * Route fragment matcher.
 *
 * @typeParam TRoute  A type of supported route.
 */
export interface RouteMatcher<TRoute extends PathRoute = PathRoute> {

  /**
   * Tests whether a fragment of the route satisfying this matcher's conditions.
   *
   * @param context  Route match context.
   *
   * @returns {@link RouteMatcher.Match Route match} instance specifying a matching route fragment,
   * or `false`/`null`/`undefined` otherwise.
   */
  test(
      context: RouteMatcher.Context<TRoute>,
  ): RouteMatcher.Match<TRoute> | false | null | undefined;

  /**
   * Searches for the fragment of the route satisfying this matcher's conditions.
   *
   * In contrast to the [[test]] method this one attempts to find the matching fragment starting at some offset from
   * current position specified by `context`, and then tries to match the remaining path against the remaining pattern.
   *
   * The matching route fragment always starts within current route entry.
   *
   * @param context  Route match context.
   *
   * @returns A tuple containing a {@link RouteMatch match} of the remaining path against the remaining pattern and
   * an offset within current entry name the matching route fragment starts at, or `false`/`null`/`undefined` if match
   * not found.
   */
  find?(
      context: RouteMatcher.Context<TRoute>,
  ): readonly [RouteMatch, number] | false | null | undefined;

  /**
   * Detects whether this matcher still matches after the end of the route.
   *
   * @param context  Route tail match context.
   *
   * @returns `true` if the route satisfies this matcher's condition, or `false` otherwise.
   */
  tail?(context: RouteMatcher.TailContext<TRoute>): boolean;

}

export namespace RouteMatcher {

  /**
   * A position of the match inside the route.
   *
   * May represent a position after the end of the route.
   *
   * @typeParam TRoute  A type of tested route.
   */
  export interface Position<TRoute extends PathRoute> {

    /**
     * Target route.
     */
    readonly route: TRoute;

    /**
     * The first entry of the match or `undefined` for the position after the route end.
     */
    readonly entry?: TRoute['path'][0];

    /**
     * The index of the {@link entry first entry} of the match.
     *
     * Equals to path length for the position after the end of the route.
     */
    readonly entryIndex: number;

    /**
     * An offset of the first character within the {@link entry first entry} of the match.
     */
    readonly nameOffset: number;

    /**
     * The route pattern the matcher belongs to.
     */
    readonly pattern: RoutePattern<TRoute>;

    /**
     * The index of the matcher in the route pattern.
     */
    readonly matcherIndex: number;

  }

  /**
   * Route match context.
   *
   * This is passed to {@link RouteMatcher.test route matcher} to indicate the position inside the route the match
   * should be searched at.
   *
   * @typeParam TRoute  A type of tested route.
   */
  export interface Context<TRoute extends PathRoute> extends Position<TRoute> {

    /**
     * The first entry the matcher should match against.
     */
    readonly entry: TRoute['path'][0];

    /**
     * The index of the {@link entry first entry} within the {@link route route path} the matcher should match against.
     *
     * Always less than path length.
     */
    readonly entryIndex: number;

    /**
     * An offset of the first character within {@link entry first entry} name the matcher should match against.
     */
    readonly nameOffset: number;

  }

  /**
   * Route tail match context.
   *
   * This is passed to {@link RouteMatcher.tail tail route matcher} to indicate the position after the end of the route
   * the match should be applied to.
   *
   * @typeParam TRoute  A type of tested route.
   */
  export interface TailContext<TRoute extends PathRoute> extends Position<TRoute> {

    /**
     * `undefined` route entry indicating the position after the end of the route.
     */
    readonly entry?: undefined;

    /**
     * The length of the route path to indicate the position after the end of the route.
     */
    readonly entryIndex: number;

    /**
     * Always zero to indicate the position after the end of the route.
     */
    readonly nameOffset: 0;

  }

  /**
   * Route match.
   *
   * This is returned from {@link RouteMatch route matcher} and indicates the matching part of the route.
   *
   * @typeParam TRoute  A type of matching route.
   */
  export interface Match<TRoute extends PathRoute = PathRoute> {

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
     * A callback function reporting a capture of this match, if any.
     *
     * It will be invoked by {@link RouteMatch successful route match} only.
     */
    readonly callback?: RouteMatch<TRoute>;

  }

}
