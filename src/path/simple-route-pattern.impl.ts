import { decodeURISearchPart } from 'httongue';
import type { RouteMatcher } from '../route-matcher.js';
import { rmatchEntry } from '../matchers/rmatch-entry.js';
import { rmatchDirs } from '../matchers/rmatch-dirs.js';
import { rcaptureDirs } from '../matchers/rcapture-dirs.js';
import { rcaptureEntry } from '../matchers/rcapture-entry.js';

/**
 * @internal
 */
export function simpleRouteMatcher(
  pattern: string,
  matcherBySpec: (spec: string) => RouteMatcher | undefined = simpleRouteWildcard,
): RouteMatcher | undefined {
  switch (pattern) {
    case '*':
      return rmatchEntry;
    case '**':
      return rmatchDirs;
    default:
      if (pattern.startsWith('{') && pattern.indexOf('}') >= pattern.length - 1) {
        const spec = pattern.slice(1, pattern.length - 1);

        return matcherBySpec(spec) || simpleRouteCapture(spec);
      }

      return;
  }
}

/**
 * @internal
 */
export function simpleRouteWildcard(spec: string): RouteMatcher | undefined {
  const colonIdx = spec.indexOf(':');

  if (colonIdx >= 0) {
    const capture = decodeURISearchPart(spec.slice(0, colonIdx).trim());
    const arg = spec.slice(colonIdx + 1).trim();

    if (arg === '**') {
      return capture ? rcaptureDirs(decodeURISearchPart(capture)) : rmatchDirs;
    }

    return capture ? rcaptureEntry(capture) : rmatchEntry;
  }

  return;
}

/**
 * @internal
 */
function simpleRouteCapture(spec: string): RouteMatcher {
  spec = spec.trim();

  return spec ? rcaptureEntry(decodeURISearchPart(spec)) : rmatchEntry;
}
