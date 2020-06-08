/**
 * @packageDocumentation
 * @module @hatsy/route-match
 */
/**
 * A route representing a path to file or directory.
 */
export interface PathRoute {

  /**
   * A path split onto file and directory entries.
   */
  readonly path: readonly PathEntry[];

  /**
   * Whether this is a route to directory.
   */
  readonly dir: boolean;

  /**
   * Extracts a segment of this route between the given entry indices.
   *
   * @param from  Zero-based index at which to start extraction. A negative index is treated as zero.
   * @param to  Zero-based index before which to end extraction. A value greater than the path length is treated as
   * equal to path length. If this value is less than `from`, an empty route is returned.
   *
   * @returns Either new route, or this one if slicing returned to the route of the same path length.
   */
  segment(from: number, to?: number): PathRoute;

  /**
   * Builds a string representation of this route.
   *
   * @returns URL-encoded pathname without leading `/`.
   */
  toString(): string;

}

/**
 * Path entry.
 *
 * Represents either file or directory.
 */
export interface PathEntry {

  /**
   * Target file or directory name.
   */
  readonly name: string;

}
