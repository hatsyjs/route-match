import { pathRouteByURL } from './path-route';

describe('pathRouteByURL', () => {
  it('is empty for `/`', () => {
    expect(pathRouteByURL(new URL('http://localhost'))).toEqual({
      path: [],
      dir: true,
      toString: expect.any(Function),
    });
  });
  it('has one empty entry for `//`', () => {
    expect(pathRouteByURL(new URL('http://localhost//'))).toEqual({
      path: [{ name: '' }],
      dir: true,
      toString: expect.any(Function),
    });
  });
  it('has two empty entries for `///', () => {
    expect(pathRouteByURL(new URL('http://localhost///'))).toEqual({
      path: [{ name: '' }, { name: '' }],
      dir: true,
      toString: expect.any(Function),
    });
  });
  it('is directory when ends with `/`', () => {
    expect(pathRouteByURL(new URL('http://localhost/some/dir/'))).toEqual({
      path: [{ name: 'some' }, { name: 'dir' }],
      dir: true,
      toString: expect.any(Function),
    });
  });
  it('is file when does not end with `/`', () => {
    expect(pathRouteByURL(new URL('http://localhost/some/file'))).toEqual({
      path: [{ name: 'some' }, { name: 'file' }],
      dir: false,
      toString: expect.any(Function),
    });
  });
  it('contains entries with URL-decoded names', () => {
    expect(pathRouteByURL(new URL('http://localhost/some%20dir/'))).toEqual({
      path: [{ name: 'some dir' }],
      dir: true,
      toString: expect.any(Function),
    });
  });

  describe('toString', () => {
    it('is empty string for empty route', () => {
      expect(pathRouteByURL(new URL('http://localhost')).toString()).toBe('');
    });
    it('URL-encodes file path', () => {
      expect(pathRouteByURL(new URL('http://localhost/some dir/some%20file')).toString())
          .toBe('some%20dir/some%20file');
    });
    it('terminates directory path with `/`', () => {
      expect(pathRouteByURL(new URL('http://localhost/some%20dir/')).toString())
          .toBe('some%20dir/');
    });
  });
});
