import { decodeURISearchPart } from 'httongue';
import { PathEntry, PathRoute } from '../path/path-route.js';
import { parseURLRoute } from './url-route.impl.js';

/**
 * A route representing an URL.
 */
export interface URLRoute extends PathRoute {
  /**
   * URL this route represents, except for the pathname.
   *
   * Intended to be immutable.
   */
  readonly url: URL;

  /**
   * A path split onto URL entries.
   */
  readonly path: readonly URLEntry[];

  /**
   * Extracts a section of this route between the given entry indices.
   *
   * When segment starts from the beginning of the route (i.e. `from === 0`), its URL retains protocol, host, port,
   * user, and password. Otherwise segment's URL path becomes relative to `route:/` one.
   *
   * When segment ends at the last path entry (i.e. `to` is absent or equal to path length), its URL retains search
   * parameters. Otherwise they are removed.
   *
   * @param fromEntry - Zero-based index at which to start extraction. A negative index is treated as zero.
   * @param toEntry - Zero-based index before which to end extraction. An absent value or the value greater than the
   * path length is treated as equal to path length. If this value is less than `from`, an empty route is returned.
   *
   * @returns Either a route section, or this route if section has the same length.
   */
  section(fromEntry: number, toEntry?: number): this;

  /**
   * Builds a string representation of this route.
   *
   * @returns Raw URL pathname without leading `/` with URL search parameters if present.
   */
  toString(): string;
}

/**
 * URL route entry.
 */
export interface URLEntry extends PathEntry {
  /**
   * File or directory name, URL-decoded.
   */
  readonly name: string;

  /**
   * Raw entry representation, not URL-decoded.
   *
   * This is used in string representation of route.
   */
  readonly raw: string;

  /**
   * Raw entry name representation, not URL-decoded.
   *
   * This is used in a {@link PathRoute.toPathString string representation of the route path}.
   */
  readonly rawName: string;
}

/**
 * @internal
 */
function parseURLEntry(raw: string): URLEntry {
  return { name: decodeURISearchPart(raw), raw, rawName: raw };
}

/**
 * Constructs a route by URL.
 *
 * @param url - Source URL. If string given, then URL will be constructed relatively to `route:/` base.
 *
 * @returns New URL route instance.
 */
export function urlRoute(url: URL | string): URLRoute {
  return parseURLRoute(url, parseURLEntry);
}
