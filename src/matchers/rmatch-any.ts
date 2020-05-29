/**
 * @packageDocumentation
 * @module @hatsy/route-match
 */
import type { RouteMatcher } from '../route-matcher';
import { rmatchBind } from './rmatch-bind';

export const rmatchAny: RouteMatcher = (/*#__PURE__*/ rmatchBind());
