import type { RouteMatcher } from '../route-matcher.js';
import { rcaptureAny } from './rcapture-any.js';

/**
 * Route matcher that matches any part of the entry name.
 */
export const rmatchAny: RouteMatcher = /*#__PURE__*/ rcaptureAny();
