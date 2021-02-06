import type { RouteMatcher } from '../route-matcher';
import { rcaptureEntry } from './rcapture-entry';

/**
 * Route matcher that matches any route entry.
 */
export const rmatchEntry: RouteMatcher = (/*#__PURE__*/ rcaptureEntry());
