import { urlRoute } from './url-route';

describe('urlRoute', () => {
  it('has empty query when without search params', () => {
    expect(urlRoute(new URL('http://localhost/some/file'))).toEqual({
      path: [{ name: 'some' }, { name: 'file' }],
      dir: false,
      query: {},
    });
  });
  it('has query when search params present', () => {
    expect(urlRoute(new URL('http://localhost/some/file?param1&param2=value1&param2=value2'))).toEqual({
      path: [{ name: 'some' }, { name: 'file' }],
      dir: false,
      query: {
        param1: [''],
        param2: ['value1', 'value2'],
      },
    });
  });
});
