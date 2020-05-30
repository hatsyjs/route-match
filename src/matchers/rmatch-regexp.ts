/**
 * @packageDocumentation
 * @module @hatsy/route-match
 */
import type { PathRoute } from '../path';
import type { RouteCapture } from '../route-capture';
import type { RouteMatch } from '../route-match';
import type { RouteMatcher } from '../route-matcher';

export function rmatchRegExp<
    TEntry extends PathRoute.Entry,
    TRoute extends PathRoute<TEntry>,
    >(
    expected: RegExp,
    name?: string,
): RouteMatcher<TEntry, TRoute> {

  const global = expected.global;
  const re = expected.sticky ? new RegExp(expected) : new RegExp(expected.source, `${expected.flags}y`);

  return {
    test(context): RouteMatcher.Match | undefined {

      const { entry, nameOffset } = context;

      re.lastIndex = nameOffset;

      let execResult = re.exec(entry.name);

      if (!execResult) {
        return;
      }

      let nameChars = re.lastIndex;
      let resultCallback!: RouteMatch<TEntry, TRoute> | undefined;

      // Fill group names.
      for (;;) {
        if (name != null) {

          const prevCallback = resultCallback;
          const match = execResult;
          const nextCallback = (capture: RouteCapture<TEntry, TRoute>): void => capture('regexp', name, match, context);

          resultCallback = prevCallback
              ? capture => { prevCallback(capture); nextCallback(capture); }
              : nextCallback;
        }

        if (!global) {
          break;
        }

        // Repeat the search for global pattern.
        execResult = re.exec(entry.name);
        if (!execResult) {
          break;
        }
        nameChars = re.lastIndex;
      }

      return {
        nameChars,
        callback: resultCallback,
      };
    },
  };
}
