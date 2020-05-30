/**
 * @packageDocumentation
 * @module @hatsy/route-match
 */
import type { RouteMatcher } from '../route-matcher';
import { rmatchDirs } from './rmatch-dirs';

export const rmatchAnyDirs: RouteMatcher = (/*#__PURE__*/ rmatchDirs());
