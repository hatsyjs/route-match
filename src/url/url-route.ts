/**
 * @packageDocumentation
 * @module @hatsy/route-match
 */
import type { PathRoute } from '../path';

export interface URLRoute<TEntry extends PathRoute.Entry = PathRoute.Entry> extends PathRoute<TEntry> {

  readonly query: Readonly<Record<string, readonly string[]>>;

}
