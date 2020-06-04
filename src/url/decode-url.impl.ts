/**
 * @internal
 */
export function decodeURLComponent(url: string): string {
  return decodeURIComponent(url.replace(/\+/g, '%20'));
}
