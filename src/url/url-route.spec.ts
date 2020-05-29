import { urlRoute } from './url-route';

describe('urlRoute', () => {
  it('has empty query when without search params', () => {
    expect(urlRoute(new URL('http://localhost/some/file'))).toEqual({
      path: [{ name: 'some' }, { name: 'file' }],
      dir: false,
      query: {},
      toString: expect.any(Function),
    });
  });
  it('has query when search params present', () => {
    expect(urlRoute(new URL('http://localhost/some/file?param1&param%202=value1&param 2=value%202'))).toEqual({
      path: [{ name: 'some' }, { name: 'file' }],
      dir: false,
      query: {
        param1: [''],
        'param 2': ['value1', 'value 2'],
      },
      toString: expect.any(Function),
    });
  });

  describe('toString', () => {
    it('appends query search parameters', () => {
      expect(urlRoute(new URL('http://localhost/some%20dir/?param%201&param2=value1&param2=value%202')).toString())
          .toBe('some%20dir/?param%201=&param2=value1&param2=value%202');
    });
    it('has empty path for empty route', () => {
      expect(urlRoute(new URL('http://localhost?param')).toString()).toBe('?param=');
    });
  });
});
