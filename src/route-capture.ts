/**
 * @packageDocumentation
 * @module @hatsy/route-match
 */
import type { PathRoute } from './path';
import type { RouteMatcher } from './route-matcher';

/**
 * Route capture callback signature.
 *
 * This is a function that can be passed to {@link RouteMatch route match} in order to receive partial route matches.
 * I.e. matching fragments of the route captured by different matchers.
 *
 * This function parameters depend on the kind of the capture reported by corresponding matcher.
 * The {@link RouteCaptureSignatureMap} maps capture kinds to their callback signatures.
 *
 * @typeparam TEntry  A type of matching route entries.
 * @typeparam TRoute  A type of matching route.
 */
export type RouteCapture<
    TEntry extends PathRoute.Entry = PathRoute.Entry,
    TRoute extends PathRoute<TEntry> = PathRoute<TEntry>,
    > =
/**
 * @typeparam TKind  A type of the capture kind. Corresponds to method names of {@link RouteCaptureSignatureMap}.
 *
 * @param type  A kind of the capture.
 * @param capture  The capture to report.
 */
    <TKind extends keyof RouteCaptureSignatureMap>(
        this: void,
        kind: TKind,
        ...capture: Parameters<RouteCaptureSignatureMap<TEntry, TRoute>[TKind]>
    ) => void;

/**
 * A map of the {@link RouteCapture capture callback} signatures depending on their kinds.
 *
 * Each method name corresponds to capture kind, while its signature represents the capture itself.
 *
 * @typeparam TEntry  A type of matching route entries.
 * @typeparam TRoute  A type of matching route.
 */
export interface RouteCaptureSignatureMap<
    TEntry extends PathRoute.Entry = PathRoute.Entry,
    TRoute extends PathRoute<TEntry> = PathRoute<TEntry>,
    > {

  /**
   * Arbitrary route capture.
   *
   * Captured by {@link rmatchCapture} matcher.
   *
   * @param name  The name of the capture.
   * @param value  The captured string value.
   * @param context  A context of the capturing matcher.
   */
  capture(name: string, value: string, context: RouteMatcher.Context<TEntry, TRoute>): void;

  /**
   * Directories capture.
   *
   * Captured by {@link rmatchDirs} matcher.
   *
   * @param name  The name of the capture.
   * @param upto  An index of the route entry following the last captured one.
   * The first captured entry is in {@link RouteMatcher.Context.entryIndex `context`}.
   * @param context  A context of the capturing matcher.
   */
  dirs(name: string, upto: number, context: RouteMatcher.Context<TEntry, TRoute>): void;

  /**
   * Regular expression capture.
   *
   * Captured by {@link rmatchRegExp} matcher.
   *
   * Such capture callback may be called multiple times per matcher if the matching regexp is global.
   *
   * @param name  The name of the capture.
   * @param match  The regexp match array returned from `RegExp.prototype.exec()` method call.
   * @param context  A context of the capturing matcher.
   */
  regexp(name: string, match: RegExpExecArray, context: RouteMatcher.Context<TEntry, TRoute>): void;

}
