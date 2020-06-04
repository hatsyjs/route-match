import { urlRoute } from './url-route';

describe('urlRoute', () => {
  it('is empty for `/`', () => {

    const url = new URL('http://localhost');

    expect(urlRoute(url)).toEqual({
      url,
      path: [],
      dir: true,
      toString: expect.any(Function),
    });
  });
  it('has one empty entry for `//`', () => {

    const url = new URL('http://localhost//');

    expect(urlRoute(url)).toEqual({
      url,
      path: [{ name: '' }],
      dir: true,
      toString: expect.any(Function),
    });
  });
  it('has two empty entries for `///', () => {

    const url = new URL('http://localhost///');

    expect(urlRoute(url)).toEqual({
      url,
      path: [{ name: '' }, { name: '' }],
      dir: true,
      toString: expect.any(Function),
    });
  });
  it('is directory when ends with `/`', () => {

    const url = new URL('http://localhost/some/dir/');

    expect(urlRoute(url)).toEqual({
      url,
      path: [{ name: 'some' }, { name: 'dir' }],
      dir: true,
      toString: expect.any(Function),
    });
  });
  it('is file when does not end with `/`', () => {

    const url = new URL('http://localhost/some/file');

    expect(urlRoute(url)).toEqual({
      url,
      path: [{ name: 'some' }, { name: 'file' }],
      dir: false,
      toString: expect.any(Function),
    });
  });
  it('contains entries with URL-decoded names', () => {

    const url = new URL('http://localhost/some%20dir/');

    expect(urlRoute(url)).toEqual({
      url,
      path: [{ name: 'some dir' }],
      dir: true,
      toString: expect.any(Function),
    });
  });

  describe('toString', () => {
    it('is empty string for empty route', () => {
      expect(urlRoute(new URL('http://localhost')).toString()).toBe('');
    });
    it('URL-encodes file path', () => {
      expect(urlRoute(new URL('http://localhost/some dir/some%20file')).toString())
          .toBe('some%20dir/some%20file');
    });
    it('terminates directory path with `/`', () => {
      expect(urlRoute(new URL('http://localhost/some%20dir/')).toString())
          .toBe('some%20dir/');
    });
    it('appends query search parameters', () => {
      expect(urlRoute(new URL('http://localhost/some%20dir/?param%201&param2=value1&param2=value%202')).toString())
          .toBe('some%20dir/?param+1=&param2=value1&param2=value+2');
    });
    it('has empty path for empty route', () => {
      expect(urlRoute(new URL('http://localhost?param')).toString()).toBe('?param=');
    });
  });
});
