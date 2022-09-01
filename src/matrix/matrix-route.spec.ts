import { describe, expect, it } from '@jest/globals';
import { matrixRoute } from './matrix-route';

describe('matrixRoute', () => {
  it('has attributes', () => {
    const url = new URL('http://localhost/some;attr1=value1;attr1=value2/file;attr3=value3;attr4');
    const route = matrixRoute(url);

    expect(route).toEqual({
      url,
      path: [expect.objectContaining({ name: 'some' }), expect.objectContaining({ name: 'file' })],
      dir: false,
      section: expect.any(Function),
      toString: expect.any(Function),
      toPathString: expect.any(Function),
    });

    expect(route.path[0].attrs.getAll('attr1')).toEqual(['value1', 'value2']);
    expect(route.path[1].attrs.getAll('attr3')).toEqual(['value3']);
    expect(route.path[1].attrs.getAll('attr4')).toEqual(['']);
  });

  describe('toString', () => {
    it('is empty string for empty route', () => {
      expect(matrixRoute(new URL('http://localhost')).toString()).toBe('');
    });
    it('URL-encodes file path', () => {
      expect(matrixRoute(new URL('http://localhost/some dir/some%20file')).toString()).toBe(
        'some%20dir/some%20file',
      );
    });
    it('terminates directory path with `/`', () => {
      expect(matrixRoute(new URL('http://localhost/some%20dir/')).toString()).toBe('some%20dir/');
    });
    it('does no alter matrix attributes', () => {
      expect(
        matrixRoute(
          new URL('http://localhost/some%20dir/;param+1;param2=value+1;param2=value%202'),
        ).toString(),
      ).toBe('some%20dir/;param+1;param2=value+1;param2=value%202');
    });
  });

  describe('toPathString', () => {
    it('excludes matrix attributes', () => {
      expect(
        matrixRoute(
          'http://localhost/some%20dir/;param+1;param2=value+1;param2=value%202',
        ).toPathString(),
      ).toBe('some%20dir/');
    });
    it('excludes search parameters attributes', () => {
      expect(matrixRoute('http://localhost/some.html?param=value').toPathString()).toBe(
        'some.html',
      );
    });
  });
});
