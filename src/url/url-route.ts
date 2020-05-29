/**
 * @packageDocumentation
 * @module @hatsy/route-match
 */
import type { PathRoute } from '../path';
import { pathRouteByURL } from '../path';

export interface URLRoute<TEntry extends PathRoute.Entry = PathRoute.Entry> extends PathRoute<TEntry> {

  readonly query: Readonly<Record<string, readonly string[]>>;

}

export function urlRoute(url: URL): URLRoute {

  const urlRoute = pathRouteByURL(url) as PathRoute & { query: Readonly<Record<string, readonly string[]>> };
  const query: Record<string, readonly string[]> = {};

  url.searchParams.forEach((_value, name, parent) => {
    query[name] = parent.getAll(name);
  });

  urlRoute.query = query;

  return urlRoute;
}
