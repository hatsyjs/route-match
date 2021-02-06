import { decodeURLComponent } from '@frontmeans/httongue';
import { rmatchDirSep, rmatchName } from '../matchers';
import type { RoutePattern } from '../route-match';
import type { RouteMatcher } from '../route-matcher';
import { simpleRouteMatcher } from './simple-route-pattern.impl';

/**
 * Parses simple route pattern.
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
 *   Corresponds to {@link rmatchEntry}.
 *
 * - `/{capture}` captures any route entry as `capture`.
 *   Corresponds to {@link rcaptureEntry}.
 *
 * - `/**` matches any number of directories.
 *   Corresponds to {@link rmatchDirs}
 *
 * - `/{capture:**}` captures any number of directories as `capture`.
 *   Corresponds to {@link rcaptureDirs}.
 *
 * - Everything else matches verbatim and corresponds to {@link rmatchName}.
 *
 * The pattern parts are URL-decoded after parsing. So the pattern string may contain URL-encoded reserved and special
 * characters.
 *
 * @param pattern - Pattern string.
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
    if (!part) {
      continue;
    }

    const partMatcher = simpleRouteMatcher(part);

    if (partMatcher) {
      result.push(partMatcher);
    } else {
      result.push(rmatchName(decodeURLComponent(part)));
    }
  }

  return result;
}
