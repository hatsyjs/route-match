/**
 * @packageDocumentation
 * @module @hatsy/route-match
 */
import type { PathEntry, PathRoute } from '../path';
import { decodeURLComponent } from './decode-url.impl';
import { parseURLRoute } from './url-route.impl';

/**
 * A route representing an URL.
 */
export interface URLRoute extends PathRoute {

  /**
   * URL this route represents.
   *
   * Do not modify it.
   */
  readonly url: URL;

  /**
   * Builds a string representation of this route.
   *
   * @returns URL-encoded pathname without leading `/` with URL search parameters if present.
   */
  toString(): string;

}

/**
 * @internal
 */
function urlEntry(name: string): PathEntry {
  return { name: decodeURLComponent(name) };
}

/**
 * Constructs a route by URL.
 *
 * @param url  Source URL.
 *
 * @returns New URL route instance.
 */
export function urlRoute(url: URL): URLRoute {
  return parseURLRoute(url, urlEntry);
}
