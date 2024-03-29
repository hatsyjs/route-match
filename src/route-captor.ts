import { PathRoute } from './path/path-route.js';
import type { RouteMatcher } from './route-matcher.js';

/**
 * Route capture receiver signature.
 *
 * This is a function that can be passed to {@link RouteMatch route match} in order to receive partial route matches.
 * I.e. matching fragments of the route captured by different matchers.
 *
 * This function parameters depend on the kind of the capture reported by corresponding matcher.
 * The {@link RouteCaptorSignatureMap} maps capture kinds to their callback signatures.
 *
 * @typeParam TRoute - A type of matching route.
 */
export type RouteCaptor<TRoute extends PathRoute = PathRoute> =
  /**
   * @typeParam TKind - A type of the capture kind. Corresponds to method names of {@link RouteCaptorSignatureMap}.
   *
   * @param type - A kind of the capture.
   * @param key - The key of the capture. Either named capture name, or anonymous match index.
   * @param capture - The capture to report.
   */
  <TKind extends keyof RouteCaptorSignatureMap<TRoute>>(
    this: void,
    kind: TKind,
    key: string | number,
    ...capture: Parameters<RouteCaptorSignatureMap<TRoute>[TKind]>
  ) => void;

/**
 * A map of the {@link RouteCaptor capture receiver} signatures depending on their kinds.
 *
 * Each method name corresponds to capture kind, while its signature represents the capture itself.
 *
 * @typeParam TRoute - A type of matching route.
 */
export interface RouteCaptorSignatureMap<TRoute extends PathRoute> {
  /**
   * Arbitrary route capture.
   *
   * Captured by {@link rmatchAny}, {@link rcaptureAny}, {@link rcaptureEntry} and {@link rmatchEntry} matchers.
   *
   * @param value - The captured string value.
   * @param context - A context of the capturing matcher.
   */
  capture(value: string, context: RouteMatcher.Context<TRoute>): void;

  /**
   * Directories capture.
   *
   * Captured by {@link rmatchDirs} as {@link rcaptureDirs} matcher.
   *
   * @param upto - An index of the route entry following the last captured one.
   * The first captured entry is in {@link RouteMatcher.Context.entryIndex `context`}.
   * @param context - A context of the capturing matcher.
   */
  dirs(upto: number, context: RouteMatcher.Context<TRoute>): void;

  /**
   * Regular expression capture.
   *
   * Captured by {@link rcaptureRegExp} matcher.
   *
   * Such capture may be reported multiple times per matcher if the matching regexp is global.
   *
   * @param match - The regexp match array returned from `RegExp.prototype.exec()` method call.
   * @param context - A context of the capturing matcher.
   */
  regexp(match: RegExpExecArray, context: RouteMatcher.Context<TRoute>): void;
}
