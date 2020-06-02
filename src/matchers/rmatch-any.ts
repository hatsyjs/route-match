/**
 * @packageDocumentation
 * @module @hatsy/route-match
 */
import type { RouteMatcher } from '../route-matcher';
import { rcatch } from './rcatch';

/**
 * Route matcher that matches any part of the entry name.
 */
export const rmatchAny: RouteMatcher = (/*#__PURE__*/ rcatch());
