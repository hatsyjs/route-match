/**
 * @packageDocumentation
 * @module @hatsy/route-match
 */
/**
 * A route representing a path to file or directory.
 *
 * @typeparam TEntry  A type of route entries.
 */
export interface PathRoute<TEntry extends PathRoute.Entry = PathRoute.Entry> {

  /**
   * A path split onto file and directory entries.
   */
  readonly path: readonly TEntry[];

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

export namespace PathRoute {

  /**
   * Route entry.
   *
   * Represents either file or directory.
   */
  export interface Entry {

    /**
     * Target file or directory name.
     */
    readonly name: string;

  }

}
