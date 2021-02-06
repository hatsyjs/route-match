import type { RouteMatcher } from '../route-matcher';

/**
 * Builds a route matcher that matches any entry and captures its name.
 *
 * Matches only at the {@link RouteMatcher.Context.nameOffset entry name beginning}.
 *
 * @param name - The name of the capture or nothing to capture under match index.
 * @returns New route matcher.
 *
 * @see Use {@link rmatchEntry} for anonymous capture.
 */
export function rcaptureEntry(name?: string): RouteMatcher {

  const key = name ?? 0;

  return {
    test: context => !context.nameOffset && {
      callback(captor) {
        captor('capture', key, context.entry.name, context);
      },
    },
  };
}
