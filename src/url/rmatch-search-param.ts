/**
 * @packageDocumentation
 * @module @hatsy/route-match
 */
import type { PathRoute } from '../path';
import type { RouteMatcher } from '../route-matcher';
import type { URLRoute } from './url-route';

export function rmatchSearchParam(name: string, value?: string): RouteMatcher<PathRoute.Entry, URLRoute> {

  const condition: (position: RouteMatcher.Position<PathRoute.Entry, URLRoute>) => boolean = value == null
      ? ({ route: { url: { searchParams } } }) => searchParams.has(name)
      : ({ route: { url: { searchParams } } }) => searchParams.getAll(name).includes(value);

  return {
    test: context => condition(context) && { nameChars: 0 },
    tail: condition,
  };
}
