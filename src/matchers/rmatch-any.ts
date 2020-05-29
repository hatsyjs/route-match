/**
 * @packageDocumentation
 * @module @hatsy/route-match
 */
import type { RouteMatcher } from '../route-matcher';
import { rmatchCapture } from './rmatch-capture';

export const rmatchAny: RouteMatcher = (/*#__PURE__*/ rmatchCapture());
