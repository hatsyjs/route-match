/**
 * @packageDocumentation
 * @module @hatsy/route-match
 */
import type { PathRoute } from './path-route';
import type { RouteMatch, RoutePattern } from './route-match';

/**
 * Route matcher function signature.
 *
 * Tests whether some part of the given route satisfies this matcher's conditions or not. If so, then it specifies
 * the part of the route path that matches, a {@link RouteMatch.Specificity specificity} of this match, and may also
 * bind some values to final {@link RouteMatch.Results match result}.
 *
 * @typeparam TEntry  A type of supported route path entries.
 * @typeparam TRoute  A type of supported route path.
 */
export type RouteMatcher<
    TEntry extends PathRoute.Entry = PathRoute.Entry,
    TRoute extends PathRoute<TEntry> = PathRoute<TEntry>,
    > =
/**
 * @param context  Route matching context.
 *
 * @returns `true` when entry name matches, {@link RouteMatcher.Match route match} object when some part of the path
 * matches, or `false`/`null`/`undefined` when nothing matched.
 */
    (
        this: void,
        context: RouteMatcher.Context<TEntry, TRoute>,
    ) => RouteMatcher.Match | boolean | null | undefined;

export namespace RouteMatcher {

  /**
   * Route match context.
   *
   * This is passed to {@link RouteMatcher route matcher} to indicate the start of the path to match against.
   *
   * @typeparam TEntry  A type of tested route path entries.
   * @typeparam TRoute  A type of tested route path.
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
   * This is returned from {@link RouteMatch route matcher} and indicates the matching part of the path.
   */
  export interface Match {

    /**
     * A specificity of this match.
     *
     * @default `[1]`
     */
    readonly spec?: number[];

    /**
     * The number of fully matching path entries.
     *
     * When set, this value increases the index of the {@link Context.entryIndex path entry} to apply subsequent
     * matchers to.
     *
     * @default `0`, which means the subsequent matcher will be applied to {@link Context.entry current entry}.
     * @see [[nameChars]]
     */
    readonly entries?: number;

    /**
     * The number matching of character in the name of current path entry.
     *
     * This value increases the {@link Context.nameOffset offset in the name} of the path entry to apply subsequent
     * matchers to. If the resulting offset is equal or greater than the length of the name, then the next matcher will
     * be applied to the same path entry. If that fails, the next entry will be used, while the offset will be set to
     * zero.
     *
     * @default The length of current entry name.
     */
    readonly nameChars?: number;

    /**
     * A map of results to bind to final match result.
     */
    readonly results?: RouteMatch.Results;

  }

}
