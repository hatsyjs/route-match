/**
 * @packageDocumentation
 * @module @hatsy/route-match
 */
import type { RouteMatcher } from '../route-matcher';

export function rmatchRegExp(expected: RegExp, ...groups: string[]): RouteMatcher {

  const global = expected.global;
  const re = expected.sticky ? new RegExp(expected) : new RegExp(expected.source, `${expected.flags}y`);

  return {
    test({ entry: { name }, nameOffset }): RouteMatcher.Match | undefined {
      re.lastIndex = nameOffset;

      let execResult = re.exec(name);

      if (!execResult) {
        return;
      }

      let nameChars = re.lastIndex;
      let nameIdx = 0;
      const result: Record<string, string> = {};

      // Fill group names.
      while (nameIdx < groups.length) {
        for (let i = 1; i < execResult.length && nameIdx < groups.length; ++i) {
          result[groups[nameIdx++]] = execResult[i];
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
        spec: [0, Math.max(1, nameIdx)],
        nameChars,
        results: result,
      };
    },
  };
}
