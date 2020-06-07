/**
 * @packageDocumentation
 * @module @hatsy/route-match
 */
import { noop } from '@proc7ts/primitives';
import type { PathRoute } from './path';
import type { RouteMatcher } from './route-matcher';

/**
 * Route capture receiver signature.
 *
 * This is a function that can be passed to {@link RouteMatch route match} in order to receive partial route matches.
 * I.e. matching fragments of the route captured by different matchers.
 *
 * This function parameters depend on the kind of the capture reported by corresponding matcher.
 * The {@link RouteCaptorSignatureMap} maps capture kinds to their callback signatures.
 *
 * @typeparam TRoute  A type of matching route.
 */
export type RouteCaptor<TRoute extends PathRoute = PathRoute> =
/**
 * @typeparam TKind  A type of the capture kind. Corresponds to method names of {@link RouteCaptorSignatureMap}.
 *
 * @param type  A kind of the capture.
 * @param key  The key of the capture. Either named capture name, or anonymous match index.
 * @param capture  The capture to report.
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
 * @typeparam TRoute  A type of matching route.
 */
export interface RouteCaptorSignatureMap<TRoute extends PathRoute> {

  /**
   * Arbitrary route capture.
   *
   * Captured by {@link rmatchAny}, {@link rcaptureAny}, {@link rcaptureEntry} and {@link rmatchEntry} matchers.
   *
   * @param value  The captured string value.
   * @param context  A context of the capturing matcher.
   */
  capture(value: string, context: RouteMatcher.Context<TRoute>): void;

  /**
   * Directories capture.
   *
   * Captured by {@link rmatchDirs} as {@link rcaptureDirs} matcher.
   *
   * @param upto  An index of the route entry following the last captured one.
   * The first captured entry is in {@link RouteMatcher.Context.entryIndex `context`}.
   * @param context  A context of the capturing matcher.
   */
  dirs(upto: number, context: RouteMatcher.Context<TRoute>): void;

  /**
   * Regular expression capture.
   *
   * Captured by {@link rcaptureRegExp} matcher.
   *
   * Such capture may be reported multiple times per matcher if the matching regexp is global.
   *
   * @param match  The regexp match array returned from `RegExp.prototype.exec()` method call.
   * @param context  A context of the capturing matcher.
   */
  regexp(match: RegExpExecArray, context: RouteMatcher.Context<TRoute>): void;

}

/**
 * Route capture classifier.
 *
 * Optionally contains a method per each capture kind.
 *
 * Can be used to {@link classifyRouteCapture classify route capture}.
 *
 * @typeparam  A type of matching route.
 */
export type RouteCaptureClassifier<TRoute extends PathRoute = PathRoute> = {

  readonly [TKind in keyof RouteCaptorSignatureMap<TRoute>]?: (
      this: void,
      key: string | number,
      ...capture: Parameters<RouteCaptorSignatureMap<TRoute>[TKind]>
  ) => void;

};

/**
 * Creates a route capture receiver that classifies the capture by its kind.
 *
 * @param classifier  Route capture classifier.
 * @param fallback  Fallback route capture that will be called when no matching method defined in classifier.
 *
 * @returns New route capture receiver function that calls classifier's method corresponding to the kind of the capture,
 * or `fallback` function if no such method defined in classifier.
 */
export function classifyRouteCapture<TRoute extends PathRoute = PathRoute>(
    classifier: RouteCaptureClassifier<TRoute>,
    fallback: RouteCaptor<TRoute> = noop,
): RouteCaptor<TRoute> {
  return <TKind extends keyof RouteCaptorSignatureMap<TRoute>>(
      kind: TKind,
      key: string | number,
      ...capture: Parameters<RouteCaptorSignatureMap<TRoute>[TKind]>
  ) => {

    const kindCaptor = classifier[kind] as ((
        key: string | number,
        ...capture: Parameters<RouteCaptorSignatureMap<TRoute>[TKind]>
    ) => void) | undefined;

    if (kindCaptor) {
      kindCaptor(key, ...capture);
    } else {
      fallback(kind, key, ...capture);
    }
  };
}
