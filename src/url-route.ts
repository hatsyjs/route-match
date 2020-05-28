/**
 * @packageDocumentation
 * @module @hatsy/route-match
 */
import type { PathRoute } from './path-route';

export interface URLRoute<TEntry extends URLRoute.Entry = URLRoute.Entry> extends PathRoute<TEntry> {

  readonly query: Readonly<Record<string, readonly string[]>>;

}

export namespace URLRoute {

  export type Entry = PathRoute.Entry;

}

