/**
 * @internal
 */
export function isURL(value: object): value is URL {
  return 'searchParams' in value;
}
