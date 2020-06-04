import { routeMatch } from '../route-match';
import { urlRoute } from './url-route';
import { urlRoutePattern } from './url-route-pattern';

describe('urlRoutePattern', () => {
  let capture: jest.Mock;

  beforeEach(() => {
    capture = jest.fn();
  });

  it('is empty on empty string', () => {
    expect(urlRoutePattern('')).toEqual([]);
  });

  describe('name/**', () => {
    it('matches any dirs', () => {
      expect(routeMatch(
          urlRoute(new URL('http://localhost/name/some/path')),
          urlRoutePattern('name/**'),
      )).toBeTruthy();
    });
  });

  describe('name/{out:**}', () => {
    it('captures path', () => {

      const match = routeMatch(
          urlRoute(new URL('http://localhost/name/some/path')),
          urlRoutePattern('name/{out:**}'),
      );

      expect(match).toBeTruthy();
      match?.(capture);
      expect(capture).toHaveBeenCalledWith('dirs', 'out', 3, expect.anything());
    });
  });

  describe('name/{:**}', () => {
    it('captures nested path', () => {

      const match = routeMatch(
          urlRoute(new URL('http://localhost/name/some/path')),
          urlRoutePattern('name/{:**}'),
      );

      expect(match).toBeTruthy();
      match?.(capture);
      expect(capture).toHaveBeenCalledWith('dirs', 1, 3, expect.anything());
      expect(capture).toHaveBeenCalledTimes(1);
    });
  });

  describe('*/file', () => {
    it('matches dir', () => {
      expect(routeMatch(
          urlRoute(new URL('http://localhost/dir/file')),
          urlRoutePattern('*/file'),
      )).toBeTruthy();
    });
  });

  describe('*.html', () => {
    it('matches file name', () => {
      expect(routeMatch(
          urlRoute(new URL('http://localhost/file.html')),
          urlRoutePattern('*.html'),
      )).toBeTruthy();
    });
  });

  describe('file.*', () => {
    it('matches file extension', () => {
      expect(routeMatch(
          urlRoute(new URL('http://localhost/file.html')),
          urlRoutePattern('file.*'),
      )).toBeTruthy();
    });
  });

  describe('{out}/file', () => {
    it('captures dir', () => {

      const match = routeMatch(
          urlRoute(new URL('http://localhost/dir/file')),
          urlRoutePattern('{out}/file'),
      );

      expect(match).toBeTruthy();
      match?.(capture);
      expect(capture).toHaveBeenCalledWith('capture', 'out', 'dir', expect.anything());
    });
  });

  describe('{out:wrong}/file', () => {
    it('captures dir', () => {

      const match = routeMatch(
          urlRoute(new URL('http://localhost/dir/file')),
          urlRoutePattern('{out:wrong}/file'),
      );

      expect(match).toBeTruthy();
      match?.(capture);
      expect(capture).toHaveBeenCalledWith('capture', 'out', 'dir', expect.anything());
    });
  });

  describe('{:wrong}/file', () => {
    it('captures dir anonymously', () => {

      const match = routeMatch(
          urlRoute(new URL('http://localhost/dir/file')),
          urlRoutePattern('{:wrong}/file'),
      );

      match?.(capture);
      expect(capture).toHaveBeenCalledWith('capture', 1, 'dir', expect.anything());
      expect(capture).toHaveBeenCalledTimes(1);
    });
  });

  describe('{}', () => {
    it('captures file', () => {

      const match = routeMatch(
          urlRoute(new URL('http://localhost/test')),
          urlRoutePattern('{}'),
      );

      match?.(capture);
      expect(capture).toHaveBeenCalledWith('capture', 1, 'test', expect.anything());
      expect(capture).toHaveBeenCalledTimes(1);
    });
  });

  describe('{}.html', () => {
    it('captures file', () => {

      const match = routeMatch(
          urlRoute(new URL('http://localhost/test.html')),
          urlRoutePattern('{}.html'),
      );

      expect(match).toBeTruthy();
      match?.(capture);
      expect(capture).toHaveBeenCalledWith('capture', 1, 'test', expect.anything());
      expect(capture).toHaveBeenCalledTimes(1);
    });
  });

  describe('{out}.html', () => {
    it('captures file name', () => {

      const match = routeMatch(
          urlRoute(new URL('http://localhost/file.html')),
          urlRoutePattern('{out}.html'),
      );

      expect(match).toBeTruthy();
      match?.(capture);
      expect(capture).toHaveBeenCalledWith('capture', 'out', 'file', expect.anything());
    });
  });

  describe('file.{out}', () => {
    it('captures file extension', () => {

      const match = routeMatch(
          urlRoute(new URL('http://localhost/file.html')),
          urlRoutePattern('file.{out}'),
      );

      expect(match).toBeTruthy();
      match?.(capture);
      expect(capture).toHaveBeenCalledWith('capture', 'out', 'html', expect.anything());
    });
  });

  describe('{name}.{ext}', () => {
    it('captures file name and extension extension', () => {

      const match = routeMatch(
          urlRoute(new URL('http://localhost/file.html')),
          urlRoutePattern('{name}.{ext}'),
      );

      match?.(capture);
      expect(capture).toHaveBeenCalledWith('capture', 'name', 'file', expect.anything());
      expect(capture).toHaveBeenCalledWith('capture', 'ext', 'html', expect.anything());
      expect(capture).toHaveBeenCalledTimes(2);
    });
  });

  describe('dir/{(file)}', () => {
    it('captures file', () => {

      const match = routeMatch(
          urlRoute(new URL('http://localhost/dir/file')),
          urlRoutePattern('dir/{(file)}'),
      );

      match?.(capture);
      expect(capture).toHaveBeenCalledWith('regexp', 1, expect.anything(), expect.anything());
      expect([...capture.mock.calls[0][2]]).toEqual(['file']);
      expect(capture).toHaveBeenCalledTimes(1);
    });
  });

  describe('dir/{out(file)i}', () => {
    it('captures file', () => {

      const match = routeMatch(
          urlRoute(new URL('http://localhost/dir/FILE')),
          urlRoutePattern('dir/{out((fi)le)i}'),
      );

      expect(match).toBeTruthy();
      match?.(capture);
      expect(capture).toHaveBeenCalledWith('regexp', 'out', expect.any(Array), expect.anything());
      expect([...capture.mock.calls[0][2]]).toEqual(['FILE', 'FI']);
    });
  });

  describe('{)(}', () => {
    it('captures file', () => {

      const match = routeMatch(
          urlRoute(new URL('http://localhost/test')),
          urlRoutePattern('{)(}'),
      );

      expect(match).toBeTruthy();
      match?.(capture);
      expect(capture).toHaveBeenCalledWith('capture', ')(', 'test', expect.anything());
    });
  });

  describe('/', () => {
    it('matches empty route', () => {

      const match = routeMatch(
          urlRoute(new URL('http://localhost/')),
          urlRoutePattern('/'),
      );

      expect(match).toBeTruthy();
    });
  });

  describe('{some', () => {
    it('does not capture', () => {

      const match = routeMatch(
          urlRoute(new URL('http://localhost/{some')),
          urlRoutePattern('{some'),
      );

      expect(match).toBeTruthy();
      match?.(capture);
      expect(capture).not.toHaveBeenCalled();
    });
  });

  describe('**?name', () => {

    const pattern = urlRoutePattern('**?name');

    it('matches URL with required parameter', () => {
      expect(routeMatch(
          urlRoute(new URL('http://localhost/path/to/file?name=value')),
          pattern,
      )).toBeTruthy();
    });
    it('does not match URL without required parameter', () => {
      expect(routeMatch(
          urlRoute(new URL('http://localhost/path/to/file?other=value')),
          pattern,
      )).toBeNull();
    });
  });
  describe('**?name=value', () => {

    const pattern = urlRoutePattern('**?name=value');

    it('matches URL with required parameter value', () => {
      expect(routeMatch(
          urlRoute(new URL('http://localhost/path/to/file?name=other&name=value')),
          pattern,
      )).toBeTruthy();
    });
    it('does not match URL wit wrong parameter value', () => {
      expect(routeMatch(
          urlRoute(new URL('http://localhost/path/to/file?name=wrong')),
          pattern,
      )).toBeNull();
    });
  });
});
