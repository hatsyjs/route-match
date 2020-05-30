/**
 * @packageDocumentation
 * @module @hatsy/route-match
 */
import type { PathRoute } from '../path';
import type { RouteMatcher } from '../route-matcher';

export function rmatchRegExp<
    TEntry extends PathRoute.Entry,
    TRoute extends PathRoute<TEntry>,
    >(
    expected: RegExp,
    callback?: (
        this: void,
        match: RegExpMatchArray,
        context: RouteMatcher.Context<TEntry, TRoute>,
    ) => void,
): RouteMatcher<TEntry, TRoute> {

  const global = expected.global;
  const re = expected.sticky ? new RegExp(expected) : new RegExp(expected.source, `${expected.flags}y`);

  return {
    test(context): RouteMatcher.Match | undefined {

      const { entry: { name }, nameOffset } = context;

      re.lastIndex = nameOffset;

      let execResult = re.exec(name);

      if (!execResult) {
        return;
      }

      let nameChars = re.lastIndex;
      let resultCallback!: () => void | undefined;

      // Fill group names.
      for (;;) {
        if (callback) {

          const prevCallback = resultCallback;
          const match = execResult;
          const nextCallback = (): void => callback(match, context);

          resultCallback = prevCallback
              ? () => { prevCallback(); nextCallback(); }
              : nextCallback;
        }

        if (!global) {
          break;
        }

        // Repeat the search for global pattern.
        execResult = re.exec(name);
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
