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