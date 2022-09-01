import { describe, expect, it } from '@jest/globals';
import { urlRoute } from './url-route';

describe('urlRoute', () => {
  it('constructs URL relative to `route:` base', () => {
    const route = urlRoute('custom/path');

    expect(route.url.href).toBe('route:/custom/path');
    expect(route.url.protocol).toBe('route:');
    expect(route.url.hostname).toBe('');
    expect(route.path).toEqual([
      { name: 'custom', raw: 'custom', rawName: 'custom' },
      { name: 'path', raw: 'path', rawName: 'path' },
    ]);
  });
  it('constructs absolute URL relative to `route:` base', () => {
    const route = urlRoute('/custom/path');

    expect(route.url.href).toBe('route:/custom/path');
    expect(route.url.protocol).toBe('route:');
    expect(route.url.hostname).toBe('');
    expect(route.path).toEqual([
      { name: 'custom', raw: 'custom', rawName: 'custom' },
      { name: 'path', raw: 'path', rawName: 'path' },
    ]);
  });
  it('constructs http URL by string', () => {
    const route = urlRoute('http://localhost/custom/path');

    expect(route.url.href).toBe('http://localhost/custom/path');
    expect(route.url.protocol).toBe('http:');
    expect(route.url.hostname).toBe('localhost');
    expect(route.path).toEqual([
      { name: 'custom', raw: 'custom', rawName: 'custom' },
      { name: 'path', raw: 'path', rawName: 'path' },
    ]);
  });
  it('is empty for HTTP `/` path', () => {
    const url = new URL('http://localhost');

    expect(urlRoute(url)).toEqual({
      url,
      path: [],
      dir: true,
      section: expect.any(Function),
      toString: expect.any(Function),
      toPathString: expect.any(Function),
    });
  });
  it('is empty for custom `/` path', () => {
    const url = new URL('custom:/');

    expect(urlRoute(url)).toEqual({
      url,
      path: [],
      dir: true,
      section: expect.any(Function),
      toString: expect.any(Function),
      toPathString: expect.any(Function),
    });
  });
  it('is empty for empty path', () => {
    const url = new URL('custom:');

    expect(urlRoute(url)).toEqual({
      url,
      path: [],
      dir: true,
      section: expect.any(Function),
      toString: expect.any(Function),
      toPathString: expect.any(Function),
    });
  });
  it('has one empty entry for HTTP `//` path', () => {
    const url = new URL('http://localhost//');

    expect(urlRoute(url)).toEqual({
      url,
      path: [{ name: '', raw: '', rawName: '' }],
      dir: true,
      section: expect.any(Function),
      toString: expect.any(Function),
      toPathString: expect.any(Function),
    });
  });
  it('has one empty entry for custom `//` path', () => {
    const url = new URL('custom:////');

    expect(urlRoute(url)).toEqual({
      url,
      path: [{ name: '', raw: '', rawName: '' }],
      dir: true,
      section: expect.any(Function),
      toString: expect.any(Function),
      toPathString: expect.any(Function),
    });
  });
  it('has two empty entries for `///', () => {
    const url = new URL('http://localhost///');

    expect(urlRoute(url)).toEqual({
      url,
      path: [
        { name: '', raw: '', rawName: '' },
        { name: '', raw: '', rawName: '' },
      ],
      dir: true,
      section: expect.any(Function),
      toString: expect.any(Function),
      toPathString: expect.any(Function),
    });
  });
  it('is directory when HTTP path ends with `/`', () => {
    const url = new URL('http://localhost/some/dir/');

    expect(urlRoute(url)).toEqual({
      url,
      path: [
        { name: 'some', raw: 'some', rawName: 'some' },
        { name: 'dir', raw: 'dir', rawName: 'dir' },
      ],
      dir: true,
      section: expect.any(Function),
      toString: expect.any(Function),
      toPathString: expect.any(Function),
    });
  });
  it('is directory when custom path ends with `/`', () => {
    const url = new URL('custom:some/dir/');

    expect(urlRoute(url)).toEqual({
      url,
      path: [
        { name: 'some', raw: 'some', rawName: 'some' },
        { name: 'dir', raw: 'dir', rawName: 'dir' },
      ],
      dir: true,
      section: expect.any(Function),
      toString: expect.any(Function),
      toPathString: expect.any(Function),
    });
  });
  it('is file when HTTP path does not end with `/`', () => {
    const url = new URL('http://localhost/some/file');

    expect(urlRoute(url)).toEqual({
      url,
      path: [
        { name: 'some', raw: 'some', rawName: 'some' },
        { name: 'file', raw: 'file', rawName: 'file' },
      ],
      dir: false,
      section: expect.any(Function),
      toString: expect.any(Function),
      toPathString: expect.any(Function),
    });
  });
  it('is file when custom path does not end with `/`', () => {
    const url = new URL('custom:some/file');

    expect(urlRoute(url)).toEqual({
      url,
      path: [
        { name: 'some', raw: 'some', rawName: 'some' },
        { name: 'file', raw: 'file', rawName: 'file' },
      ],
      dir: false,
      section: expect.any(Function),
      toString: expect.any(Function),
      toPathString: expect.any(Function),
    });
  });
  it('contains entries with URL-decoded names', () => {
    const url = new URL('http://localhost/some+dir/');

    expect(urlRoute(url)).toEqual({
      url,
      path: [{ name: 'some dir', raw: 'some+dir', rawName: 'some+dir' }],
      dir: true,
      section: expect.any(Function),
      toString: expect.any(Function),
      toPathString: expect.any(Function),
    });
  });

  describe('section', () => {
    const route = urlRoute('http://localhost/path/to/file?param=value');

    it('returns itself as full section', () => {
      expect(route.section(-1)).toBe(route);
    });
    it('retains host and loses search params when section starts from the first entry', () => {
      const section = route.section(0, 1);

      expect(section.url.href).toBe('http://localhost/path/');
      expect(section.path).toEqual([{ name: 'path', raw: 'path', rawName: 'path' }]);
      expect(section.dir).toBe(true);
    });
    it('becomes relative to `route:/` loses search parameter when slices path in the middle', () => {
      const section = route.section(1, 2);

      expect(section.url.href).toBe('route:/to/');
      expect(section.path).toEqual([{ name: 'to', raw: 'to', rawName: 'to' }]);
      expect(section.dir).toBe(true);
    });
    it('becomes relative to `route:/` and retains search params slices to the end', () => {
      const section = route.section(1);

      expect(section.url.href).toBe('route:/to/file?param=value');
      expect(section.path).toEqual([
        { name: 'to', raw: 'to', rawName: 'to' },
        { name: 'file', raw: 'file', rawName: 'file' },
      ]);
      expect(section.dir).toBe(false);
    });
    it('returns empty route when `to > from && from > 0`', () => {
      const section = route.section(1, 0);

      expect(section.url.href).toBe('route:/');
      expect(section.path).toEqual([]);
      expect(section.dir).toBe(true);
    });
    it('returns empty route when `to === from && from === 0`', () => {
      const section = route.section(0, 0);

      expect(section.url.href).toBe('http://localhost/');
      expect(section.path).toEqual([]);
      expect(section.dir).toBe(true);
    });
    it('returns empty route when `to === from && to === path.length`', () => {
      const section = route.section(3, 3);

      expect(section.url.href).toBe('route:/?param=value');
      expect(section.path).toEqual([]);
      expect(section.dir).toBe(true);
    });
  });

  describe('toString', () => {
    it('is empty string for empty route', () => {
      expect(urlRoute(new URL('http://localhost')).toString()).toBe('');
    });
    it('URL-encodes file path', () => {
      expect(urlRoute(new URL('http://localhost/some dir/some%20file')).toString()).toBe(
        'some%20dir/some%20file',
      );
    });
    it('terminates directory path with `/`', () => {
      expect(urlRoute(new URL('http://localhost/some%20dir/')).toString()).toBe('some%20dir/');
    });
    it('appends query search parameters', () => {
      expect(
        urlRoute(
          new URL('http://localhost/some%20dir/?param+1&param2=value1&param2=value%202'),
        ).toString(),
      ).toBe('some%20dir/?param+1&param2=value1&param2=value%202');
    });
    it('has empty path for empty route', () => {
      expect(urlRoute(new URL('http://localhost?param')).toString()).toBe('?param');
    });
  });

  describe('toPathString', () => {
    it('excludes query parameters', () => {
      expect(urlRoute('http://localhost/test.html?param').toPathString()).toBe('test.html');
    });
  });
});
