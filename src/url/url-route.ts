/**
 * @packageDocumentation
 * @module @hatsy/route-match
 */
import type { PathRoute } from '../path';
import { parseURLRoute } from './url-route.impl';

/**
 * A route representing an URL.
 */
export interface URLRoute<TEntry extends PathRoute.Entry = PathRoute.Entry> extends PathRoute<TEntry> {

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
function urlRouteEntry(name: string): PathRoute.Entry {
  return { name: decodeURIComponent(name) };
}

/**
 * Constructs a route by URL.
 *
 * @param url  Source URL.
 *
 * @returns New URL route instance.
 */
export function urlRoute(url: URL): URLRoute {
  return parseURLRoute(url, urlRouteEntry);
}
