import { noop } from '@proc7ts/primitives';
import type { RouteCaptor, RouteCaptorSignatureMap } from './route-captor.js';
import { PathRoute } from './path/path-route.js';

/**
 * Route capture classifier.
 *
 * Optionally contains a method per each capture kind.
 *
 * Can be used to {@link classifyRouteCapture classify route capture}.
 *
 * @typeParam TRoute - A type of matching route.
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
 * @param classifier - Route capture classifier.
 * @param fallback - Fallback route capture that will be called when no matching method defined in classifier.
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
    const kindCaptor = classifier[kind] as
      | ((
          key: string | number,
          ...capture: Parameters<RouteCaptorSignatureMap<TRoute>[TKind]>
        ) => void)
      | undefined;

    if (kindCaptor) {
      kindCaptor(key, ...capture);
    } else {
      fallback(kind, key, ...capture);
    }
  };
}
