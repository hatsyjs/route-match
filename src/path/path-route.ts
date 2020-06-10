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
   * Extracts a section of this route between the given entry indices.
   *
   * @param fromEntry  Zero-based index at which to start extraction. A negative index is treated as zero.
   * @param toEntry  Zero-based index before which to end extraction. A value greater than the path length is treated as
   * equal to path length. If this value is less than `from`, an empty route is returned.
   *
   * @returns Either a route section, or this route if section has the same length.
   */
  section(fromEntry: number, toEntry?: number): this;

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
   * File or directory name.
   */
  readonly name: string;

}
