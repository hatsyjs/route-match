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
 */
export interface RouteMatcher<
    TEntry extends PathRoute.Entry = PathRoute.Entry,
    TRoute extends PathRoute<TEntry> = PathRoute<TEntry>,
    > {

  /**
   * Tests whether some fragment of the given route satisfies this matcher's conditions or not. If so, then it specifies
   * the fragment of the route that matches, a {@link RouteMatch.Specificity specificity} of this match, and may also
   * bind some values to final {@link RouteMatch.Results match result}.
   *
   * @param context  Route matching context.
   *
   * @returns `true` when entry name matches, {@link RouteMatcher.Match route match} object when some part of the route
   * matches, or `false`/`null`/`undefined` when nothing matched.
   */
  match(
      context: RouteMatcher.Context<TEntry, TRoute>,
  ): RouteMatcher.Match | boolean | null | undefined;

}

export namespace RouteMatcher {

  /**
   * Route match context.
   *
   * This is passed to {@link RouteMatcher route matcher} to indicate the beginning of the route to match against.
   *
   * @typeparam TEntry  A type of tested route entries.
   * @typeparam TRoute  A type of tested route.
   */
  export interface Context<TEntry extends PathRoute.Entry, TRoute extends PathRoute<TEntry>> {

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
    readonly pattern: RoutePattern<TEntry, TRoute>;

    /**
     * The index of the matcher in the route pattern.
     */
    readonly matcherIndex: number;

  }

  /**
   * Route match.
   *
   * This is returned from {@link RouteMatch route matcher} and indicates the matching part of the route.
   */
  export interface Match {

    /**
     * A specificity of this match.
     *
     * @default `[1]`
     */
    readonly spec?: number[];

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
     * A map of results to bind to {@link RouteMatch.results final match results}.
     */
    readonly results?: RouteMatch.Results;

  }

}
