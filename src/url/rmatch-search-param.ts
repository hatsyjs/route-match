import type { RouteMatcher } from '../route-matcher';
import type { URLRoute } from './url-route';

/**
 * Builds URL route matcher that matches URL search parameter.
 *
 * @param name - Required URL search parameter.
 * @param value - A value the parameter should have. Or nothing to just require the parameter to present.
 *
 * @returns New URL route matcher.
 */
export function rmatchSearchParam(name: string, value?: string): RouteMatcher<URLRoute> {
  const condition: (position: RouteMatcher.Position<URLRoute>) => boolean
    = value == null
      ? ({
          route: {
            url: { searchParams },
          },
        }) => searchParams.has(name)
      : ({
          route: {
            url: { searchParams },
          },
        }) => searchParams.getAll(name).includes(value);

  return {
    test: context => condition(context) && { nameChars: 0 },
    tail: condition,
  };
}
