import { rcaptureAny, rcaptureRegExp, rmatchAny, rmatchName, rmatchString } from '../matchers';
import type { RouteMatcher } from '../route-matcher';
import { simpleRouteMatcher } from './simple-route-pattern.impl';

/**
 * @internal
 */
export function pathRouteMatchers(
    pattern: string,
    result: RouteMatcher[],
): void {

  const simpleMatcher = simpleRouteMatcher(pattern);

  if (simpleMatcher) {
    result.push(simpleMatcher);
    return;
  }

  let patternOffset = 0;

  for (let i = 0; i < pattern.length;) {

    const c = pattern[i];
    let matcher: RouteMatcher;
    let nextOffset: number;

    switch (c) {
    case '*':
      matcher = rmatchAny;
      nextOffset = i + 1;
      break;
    case '{': {

      const specStart = i + 1;
      const specEnd = pattern.indexOf('}', specStart);

      if (specEnd < 0) {
        ++i;
        continue;
      }

      nextOffset = specEnd + 1;

      const spec = pattern.substring(specStart, specEnd);

      matcher = pathRouteRegExp(spec) || pathRouteCapture(spec);
      break;
    }
    default:
      ++i;
      continue;
    }

    if (patternOffset < i) {
      // String prefix before matcher.
      result.push(rmatchString(decodeURIComponent(pattern.substring(patternOffset, i))));
    }

    result.push(matcher);
    i = patternOffset = nextOffset;
  }

  if (patternOffset < pattern.length) {
    result.push(patternOffset
        ? rmatchString(decodeURIComponent(pattern.substr(patternOffset))) // Suffix after last matcher
        : rmatchName(decodeURIComponent(pattern))); // No matcher recognized
  }
}

/**
 * @internal
 */
export function pathRouteRegExp(spec: string): RouteMatcher | undefined {

  const openParent = spec.indexOf('(');

  if (openParent < 0) {
    return;
  }

  const closeParent = spec.lastIndexOf(')');

  if (closeParent < openParent) {
    return;
  }

  const pattern = decodeURIComponent(spec.substring(openParent + 1, closeParent));
  const flags = spec.substring(closeParent + 1).trim();
  const re = new RegExp(pattern, flags);
  const capture = spec.substr(0, openParent).trim();

  return rcaptureRegExp(re, capture ? decodeURIComponent(capture) : undefined);
}

/**
 * @internal
 */
function pathRouteCapture(spec: string): RouteMatcher {
  spec = spec.trim();
  return spec ? rcaptureAny(decodeURIComponent(spec)) : rmatchAny;
}
