import type { RouteMatcher } from '../route-matcher';
import { rcaptureAny } from './rcapture-any';

/**
 * Route matcher that matches any part of the entry name.
 */
export const rmatchAny: RouteMatcher = (/*#__PURE__*/ rcaptureAny());
