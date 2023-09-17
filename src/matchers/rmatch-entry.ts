import type { RouteMatcher } from '../route-matcher.js';
import { rcaptureEntry } from './rcapture-entry.js';

/**
 * Route matcher that matches any route entry.
 */
export const rmatchEntry: RouteMatcher = /*#__PURE__*/ rcaptureEntry();
