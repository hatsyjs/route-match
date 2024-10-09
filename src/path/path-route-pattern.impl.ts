import { decodeURISearchPart } from 'httongue';
import { rcaptureAny } from '../matchers/rcapture-any.js';
import { rcaptureRegExp } from '../matchers/rcapture-regexp.js';
import { rmatchAny } from '../matchers/rmatch-any.js';
import { rmatchName } from '../matchers/rmatch-name.js';
import { rmatchString } from '../matchers/rmatch-string.js';
import type { RouteMatcher } from '../route-matcher.js';
import { simpleRouteMatcher, simpleRouteWildcard } from './simple-route-pattern.impl.js';

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

  for (let i = 0; i < pattern.length; ) {
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
      matchers.push(rmatchString(decodeURISearchPart(pattern.substring(patternOffset, i))));
    }

    matchers.push(matcher);
    i = patternOffset = nextOffset;
  }

  if (patternOffset < pattern.length) {
    matchers.push(
      patternOffset
        ? rmatchString(decodeURISearchPart(pattern.slice(patternOffset))) // Suffix after last matcher
        : rmatchName(decodeURISearchPart(pattern)),
    ); // No matcher recognized
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

  const pattern = decodeURI(spec.substring(openParent + 1, closeParent));
  const flags = spec.slice(closeParent + 1).trim();
  const re = new RegExp(pattern, flags);
  const capture = spec.slice(0, openParent).trim();

  return rcaptureRegExp(re, capture ? decodeURISearchPart(capture) : undefined);
}

/**
 * @internal
 */
function pathRouteCapture(spec: string): RouteMatcher {
  spec = spec.trim();

  return spec ? rcaptureAny(decodeURISearchPart(spec)) : rmatchAny;
}
