/**
 * @packageDocumentation
 * @module @hatsy/route-match
 */
import type { RouteMatcher } from '../route-matcher';
import { rmatchCapture } from './rmatch-capture';

/**
 * Route matcher that matches any part of the entry name.
 */
export const rmatchAny: RouteMatcher = (/*#__PURE__*/ rmatchCapture());
