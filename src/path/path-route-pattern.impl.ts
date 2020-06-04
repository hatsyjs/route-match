import { rcaptureAny, rcaptureRegExp, rmatchAny, rmatchName, rmatchString } from '../matchers';
import type { RouteMatcher } from '../route-matcher';
import { decodeURLComponent } from '../url/decode-url.impl';
import { simpleRouteMatcher, simpleRouteWildcard } from './simple-route-pattern.impl';

/**
 * @internal
 */
export function addPathEntryMatchers(pattern: string, matchers: RouteMatcher[]): void {

  const simpleMatcher = simpleRouteMatcher(
      pattern,
      spec => simpleRouteWildcard(spec) || pathRouteRegExp(spec),
  );

  if (simpleMatcher) {
    matchers.push(simpleMatcher);
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
      matchers.push(rmatchString(decodeURLComponent(pattern.substring(patternOffset, i))));
    }

    matchers.push(matcher);
    i = patternOffset = nextOffset;
  }

  if (patternOffset < pattern.length) {
    matchers.push(patternOffset
        ? rmatchString(decodeURLComponent(pattern.substr(patternOffset))) // Suffix after last matcher
        : rmatchName(decodeURLComponent(pattern))); // No matcher recognized
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

  const pattern = decodeURLComponent(spec.substring(openParent + 1, closeParent));
  const flags = spec.substring(closeParent + 1).trim();
  const re = new RegExp(pattern, flags);
  const capture = spec.substr(0, openParent).trim();

  return rcaptureRegExp(re, capture ? decodeURLComponent(capture) : undefined);
}

/**
 * @internal
 */
function pathRouteCapture(spec: string): RouteMatcher {
  spec = spec.trim();
  return spec ? rcaptureAny(decodeURLComponent(spec)) : rmatchAny;
}
