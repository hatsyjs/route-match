/**
 * @packageDocumentation
 * @module @hatsy/route-match
 */
import type { RouteMatcher } from '../route-matcher';
import { rcatchDirs } from './rcatch-dirs';

/**
 * Route matcher that matches any number of directories, including none.
 *
 * Matches only at the {@link RouteMatcher.Context.nameOffset entry name beginning}.
 */
export const rmatchAnyDirs: RouteMatcher = (/*#__PURE__*/ rcatchDirs());
