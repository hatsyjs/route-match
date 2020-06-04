import { matrixRoute } from './matrix-route';

describe('matrixRoute', () => {
  it('has attributes', () => {

    const url = new URL('http://localhost/some;attr1=value1;attr1=value2/file;attr3=value3;attr4');
    const route = matrixRoute(url);

    expect(route).toEqual({
      url,
      path: [
        expect.objectContaining({ name: 'some' }),
        expect.objectContaining({ name: 'file' }),
      ],
      dir: false,
      toString: expect.any(Function),
    });

    expect(route.path[0].attrs.getAll('attr1')).toEqual(['value1', 'value2']);
    expect(route.path[1].attrs.getAll('attr3')).toEqual(['value3']);
    expect(route.path[1].attrs.getAll('attr4')).toEqual(['']);
  });
});
