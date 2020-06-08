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
   * URL this route represents, except for the pathname.
   *
   * The pathname of this URL is not necessarily the one this route represents. E.g. this route may represent a
   * {@link routeTail tail} of that path.
   *
   * Intended to be immutable.
   */
  readonly url: URL;

  /**
   * Extracts a segment of this route between the given entry indices.
   *
   * When segment starts from the beginning of the route (i.e. `from === 0`), its URL retains protocol, host, port,
   * user, and password. Otherwise segment's URL path becomes relative to `route:/` one.
   *
   * When segment ends at the last path entry (i.e. `to` is absent or equal to path length), its URL retains search
   * parameters. Otherwise they are removed.
   *
   * @param from  Zero-based index at which to start extraction. A negative index is treated as zero.
   * @param to  Zero-based index before which to end extraction. An absent value or the value greater than the path
   * length is treated as equal to path length. If this value is less than `from`, an empty route is returned.
   *
   * @returns Either new route, or this one if slicing returned to the route of the same path length.
   */
  segment(from: number, to?: number): URLRoute;

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
function parsePathEntry(name: string): PathEntry {
  return { name: decodeURLComponent(name) };
}

/**
 * @internal
 */
function pathEntryToString({ name }: PathEntry): string {
  return encodeURIComponent(name);
}

/**
 * Constructs a route by URL.
 *
 * @param url  Source URL. If string given, then URL will be constructed relatively to `route:/` base.
 *
 * @returns New URL route instance.
 */
export function urlRoute(url: URL | string): URLRoute {
  return parseURLRoute(url, parsePathEntry, pathEntryToString);
}
