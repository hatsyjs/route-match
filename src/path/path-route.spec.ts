import { pathRouteByURL } from './path-route';

describe('pathRouteByURL', () => {
  it('is empty for `/`', () => {
    expect(pathRouteByURL(new URL('http://localhost'))).toEqual({ path: [], dir: true });
  });
  it('has one empty entry for `//`', () => {
    expect(pathRouteByURL(new URL('http://localhost//'))).toEqual({ path: [{ name: '' }], dir: true });
  });
  it('has two empty entries for `///', () => {
    expect(pathRouteByURL(new URL('http://localhost///'))).toEqual({
      path: [{ name: '' }, { name: '' }],
      dir: true,
    });
  });
  it('is directory when ends with `/`', () => {
    expect(pathRouteByURL(new URL('http://localhost/some/dir/'))).toEqual({
      path: [{ name: 'some' }, { name: 'dir' }],
      dir: true,
    });
  });
  it('is file when does not end with `/`', () => {
    expect(pathRouteByURL(new URL('http://localhost/some/file'))).toEqual({
      path: [{ name: 'some' }, { name: 'file' }],
      dir: false,
    });
  });
});
