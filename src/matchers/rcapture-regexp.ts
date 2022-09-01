import type { RouteCaptor } from '../route-captor';
import type { RouteMatch } from '../route-match';
import { routeMatch } from '../route-match';
import type { RouteMatcher } from '../route-matcher';

const removeGlobalAndStickyFlagsPattern = /[gy]/;

/**
 * Builds a route matcher that matches a part of the name against expected regular expression, and optionally captures
 * the match.
 *
 * Reports the capture as {@link RouteCaptorSignatureMap.regexp `regexp`}.
 *
 * @param expected - The regular expression the name part expected to match.
 * @param name - The name of the capture or nothing to capture under match index.
 *
 * @returns New route matcher.
 */
export function rcaptureRegExp(expected: RegExp, name?: string): RouteMatcher {
  const key = name ?? 0;
  const { global, sticky, flags } = expected;
  const re = sticky ? new RegExp(expected) : new RegExp(expected.source, `${flags}y`);
  let searchRe: RegExp | undefined;

  return {
    test(context): RouteMatcher.Match | undefined {
      const { entry, nameOffset } = context;

      re.lastIndex = nameOffset;

      let execResult = re.exec(entry.name);

      if (!execResult) {
        return;
      }

      let nameChars = re.lastIndex;
      let resultCallback!: RouteMatch | undefined;

      // Fill group names.
      for (;;) {
        const prevCallback = resultCallback;
        const match = execResult;
        const nextCallback = (captor: RouteCaptor): void => captor('regexp', key, match, context);

        resultCallback = prevCallback
          ? captor => {
              prevCallback(captor);
              nextCallback(captor);
            }
          : nextCallback;

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

    find({
      route,
      entry,
      entryIndex: fromEntry,
      nameOffset,
      pattern,
      matcherIndex: fromMatcher,
    }): [RouteMatch, number] | null | undefined {
      if (!searchRe) {
        if (global || sticky) {
          searchRe = new RegExp(
            expected.source,
            flags.split(removeGlobalAndStickyFlagsPattern).join(''),
          );
        } else {
          searchRe = expected;
        }
      }

      const name = entry.name.substring(nameOffset);
      const found = searchRe.exec(name);

      if (!found) {
        return;
      }

      const offset = nameOffset + found.index;
      const match = routeMatch(route, pattern, {
        fromEntry,
        nameOffset: offset,
        fromMatcher,
      });

      return match && [match, offset];
    },
  };
}
