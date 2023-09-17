import type { RouteMatcher } from '../route-matcher.js';
import { rcaptureDirs } from './rcapture-dirs.js';

/**
 * Route matcher that matches any number of directories, including none.
 *
 * Matches only at the {@link RouteMatcher.Context.nameOffset entry name beginning}.
 */
export const rmatchDirs: RouteMatcher = /*#__PURE__*/ rcaptureDirs();
