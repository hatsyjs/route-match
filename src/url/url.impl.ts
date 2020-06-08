/**
 * @internal
 */
export function decodeURLComponent(url: string): string {
  return decodeURIComponent(url.replace(/\+/g, '%20'));
}

/**
 * @internal
 */
export function isURL(value: object): value is URL {
  return 'searchParams' in value;
}
