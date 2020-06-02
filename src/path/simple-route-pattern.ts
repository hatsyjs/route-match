/**
 * @packageDocumentation
 * @module @hatsy/route-match
 */
import {
  rcatchDirs,
  rcatchEntry,
  rcatchRegExp,
  rmatchAnyDirs,
  rmatchAnyEntry,
  rmatchDirSep,
  rmatchName,
} from '../matchers';
import type { RoutePattern } from '../route-match';
import type { RouteMatcher } from '../route-matcher';

/**
 * Builds simple route pattern by its string representation.
 *
 * Simple pattern can only match against whole entries. It does not support name prefixes or suffixes.
 *
 * Pattern format:
 *
 * - Empty string corresponds to empty pattern.
 *
 * - `/` matches directory separator.
 *   Corresponds to {@link rmatchDirSep}.
 *
 * - `/*` matches any route entry.
 *   Corresponds to {@link rmatchAnyEntry}.
 *
 * - `/{capture}` captures any route entry as `capture`.
 *   Corresponds to {@link rcatchEntry}.
 *
 * - `/**` matches any number of directories.
 *   Corresponds to {@link rmatchAnyDirs}
 *
 * - `/{capture:**}` captures any number of directories as `capture`.
 *   Corresponds to {@link rcatchDirs}.
 *
 * - `/{(regexp)flags}` matches the entry name matching the given regular expression with optional flags.
 *   Corresponds to {@link rcatchRegExp}.
 *
 * - `/{capture(regexp)flags}` captures the entry name matching the regular expression with optional flags.
 *   Corresponds to {@link rcatchRegExp}.
 *
 * - Everything else matches verbatim and corresponds to {@link rmatchName}.
 *
 * The pattern parts are URL-decoded after parsing. So the pattern string may contain URL-encoded reserved and special
 * characters.
 *
 * @param pattern  Pattern string.
 * @returns Simple route pattern.
 */
export function simpleRoutePattern(pattern: string): RoutePattern {
  if (!pattern) {
    return [];
  }

  const result: RouteMatcher[] = [];
  const parts = pattern.split('/');

  for (const part of parts) {
    if (result.length) {
      result.push(rmatchDirSep);
    }
    const partMatcher = simpleRouteMatcher(part);

    if (partMatcher) {
      result.push(partMatcher);
    }
  }

  return result;
}

/**
 * @internal
 */
function simpleRouteMatcher(pattern: string): RouteMatcher | undefined {
  switch (pattern) {
  case '*':
    return rmatchAnyEntry;
  case '**':
    return rmatchAnyDirs;
  default:
    if (pattern.startsWith('{') && pattern.endsWith('}')) {

      const spec = pattern.substr(1, pattern.length - 2);

      return simpleRouteWildcard(spec)
          || simpleRouteRegExp(spec)
          || simpleRouteCapture(spec);
    }

    pattern = pattern.trim();

    if (!pattern) {
      return;
    }

    return rmatchName(decodeURIComponent(pattern));
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
      return capture ? rcatchDirs(decodeURIComponent(capture)) : rmatchAnyDirs;
    }

    return capture ? rcatchEntry(capture) : rmatchAnyEntry;
  }

  return;
}

/**
 * @internal
 */
function simpleRouteRegExp(spec: string): RouteMatcher | undefined {

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

  return rcatchRegExp(re, capture ? decodeURIComponent(capture) : undefined);
}

/**
 * @internal
 */
function simpleRouteCapture(spec: string): RouteMatcher {

  spec = spec.trim();

  return spec ? rcatchEntry(decodeURIComponent(spec)) : rmatchAnyEntry;
}
