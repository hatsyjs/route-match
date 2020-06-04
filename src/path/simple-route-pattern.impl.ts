import { rcaptureDirs, rcaptureEntry, rmatchDirs, rmatchEntry } from '../matchers';
import type { RouteMatcher } from '../route-matcher';
import { pathRouteRegExp } from './path-route-pattern.impl';

/**
 * @internal
 */
export function simpleRouteMatcher(pattern: string): RouteMatcher | undefined {
  switch (pattern) {
  case '*':
    return rmatchEntry;
  case '**':
    return rmatchDirs;
  default:
    if (pattern.startsWith('{') && pattern.indexOf('}') >= pattern.length - 1) {

      const spec = pattern.substr(1, pattern.length - 2);

      return simpleRouteWildcard(spec)
          || pathRouteRegExp(spec)
          || simpleRouteCapture(spec);
    }
    return;
  }
}

/**
 * @internal
 */
function simpleRouteWildcard(spec: string): RouteMatcher | undefined {

  const colonIdx = spec.indexOf(':');

  if (colonIdx >= 0) {

    const capture = decodeURIComponent(spec.substr(0, colonIdx).trim());
    const arg = spec.substr(colonIdx + 1).trim();

    if (arg === '**') {
      return capture ? rcaptureDirs(decodeURIComponent(capture)) : rmatchDirs;
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

  return spec ? rcaptureEntry(decodeURIComponent(spec)) : rmatchEntry;
}
