/**
 * @packageDocumentation
 * @module @hatsy/route-match
 */
import type { RouteMatcher } from '../route-matcher';

export function rmatchRegExp(pattern: RegExp, ...groups: string[]): RouteMatcher {

  const global = pattern.global;
  const re = pattern.sticky ? new RegExp(pattern) : new RegExp(pattern.source, `${pattern.flags}y`);

  return {
    match({ entry: { name }, nameOffset }): RouteMatcher.Match | undefined {
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
        spec: [Math.max(1, nameIdx), 0],
        nameChars,
        results: result,
      };
    },
  };
}
