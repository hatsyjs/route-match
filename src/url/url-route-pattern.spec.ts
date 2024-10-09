import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { RouteCaptor } from '../route-captor.js';
import { routeMatch } from '../route-match.js';
import { urlRoutePattern } from './url-route-pattern.js';
import { URLRoute, urlRoute } from './url-route.js';

describe('urlRoutePattern', () => {
  let captor: RouteCaptor<URLRoute> & jest.Mock<(...args: any[]) => void>;

  beforeEach(() => {
    captor = jest.fn();
  });

  it('is empty on empty string', () => {
    expect(urlRoutePattern('')).toEqual([]);
  });

  describe('name/**', () => {
    it('matches any dirs', () => {
      expect(
        routeMatch(
          urlRoute(new URL('http://localhost/name/some/path')),
          urlRoutePattern('name/**'),
        ),
      ).toBeTruthy();
    });
  });

  describe('name/{out:**}', () => {
    it('captures path', () => {
      const match = routeMatch(
        urlRoute(new URL('http://localhost/name/some/path')),
        urlRoutePattern('name/{out:**}'),
      );

      expect(match).toBeTruthy();
      match?.(captor);
      expect(captor).toHaveBeenCalledWith('dirs', 'out', 3, expect.anything());
    });
  });

  describe('name/{:**}', () => {
    it('captures nested path', () => {
      const match = routeMatch(
        urlRoute(new URL('http://localhost/name/some/path')),
        urlRoutePattern('name/{:**}'),
      );

      expect(match).toBeTruthy();
      match?.(captor);
      expect(captor).toHaveBeenCalledWith('dirs', 1, 3, expect.anything());
      expect(captor).toHaveBeenCalledTimes(1);
    });
  });

  describe('*/file', () => {
    it('matches dir', () => {
      expect(
        routeMatch(urlRoute(new URL('http://localhost/dir/file')), urlRoutePattern('*/file')),
      ).toBeTruthy();
    });
  });

  describe('*.html', () => {
    it('matches file name', () => {
      expect(
        routeMatch(urlRoute(new URL('http://localhost/file.html')), urlRoutePattern('*.html')),
      ).toBeTruthy();
    });
  });

  describe('file.*', () => {
    it('matches file extension', () => {
      expect(
        routeMatch(urlRoute(new URL('http://localhost/file.html')), urlRoutePattern('file.*')),
      ).toBeTruthy();
    });
  });

  describe('**/*.html', () => {
    const pattern = urlRoutePattern('**/*.html');

    it('matches top-level file', () => {
      expect(routeMatch(urlRoute(new URL('route:test.html')), pattern)).toBeTruthy();
    });
    it('matches file inside directory', () => {
      expect(routeMatch(urlRoute(new URL('route:dir/test.html')), pattern)).toBeTruthy();
    });
    it('matches file deeply inside directory', () => {
      expect(
        routeMatch(urlRoute(new URL('route:deeply/nested/dir/test.html')), pattern),
      ).toBeTruthy();
    });
  });

  describe('{out}/file', () => {
    it('captures dir', () => {
      const match = routeMatch(
        urlRoute(new URL('http://localhost/dir/file')),
        urlRoutePattern('{out}/file'),
      );

      expect(match).toBeTruthy();
      match?.(captor);
      expect(captor).toHaveBeenCalledWith('capture', 'out', 'dir', expect.anything());
    });
  });

  describe('{out:wrong}/file', () => {
    it('captures dir', () => {
      const match = routeMatch(
        urlRoute(new URL('http://localhost/dir/file')),
        urlRoutePattern('{out:wrong}/file'),
      );

      expect(match).toBeTruthy();
      match?.(captor);
      expect(captor).toHaveBeenCalledWith('capture', 'out', 'dir', expect.anything());
    });
  });

  describe('{:wrong}/file', () => {
    it('captures dir anonymously', () => {
      const match = routeMatch(
        urlRoute(new URL('http://localhost/dir/file')),
        urlRoutePattern('{:wrong}/file'),
      );

      match?.(captor);
      expect(captor).toHaveBeenCalledWith('capture', 1, 'dir', expect.anything());
      expect(captor).toHaveBeenCalledTimes(1);
    });
  });

  describe('{}', () => {
    it('captures file', () => {
      const match = routeMatch(urlRoute(new URL('http://localhost/test')), urlRoutePattern('{}'));

      match?.(captor);
      expect(captor).toHaveBeenCalledWith('capture', 1, 'test', expect.anything());
      expect(captor).toHaveBeenCalledTimes(1);
    });
  });

  describe('{}.html', () => {
    it('captures file', () => {
      const match = routeMatch(
        urlRoute(new URL('http://localhost/test.html')),
        urlRoutePattern('{}.html'),
      );

      expect(match).toBeTruthy();
      match?.(captor);
      expect(captor).toHaveBeenCalledWith('capture', 1, 'test', expect.anything());
      expect(captor).toHaveBeenCalledTimes(1);
    });
  });

  describe('{out}.html', () => {
    it('captures file name', () => {
      const match = routeMatch(
        urlRoute(new URL('http://localhost/file.html')),
        urlRoutePattern('{out}.html'),
      );

      expect(match).toBeTruthy();
      match?.(captor);
      expect(captor).toHaveBeenCalledWith('capture', 'out', 'file', expect.anything());
    });
  });

  describe('file.{out}', () => {
    it('captures file extension', () => {
      const match = routeMatch(
        urlRoute(new URL('http://localhost/file.html')),
        urlRoutePattern('file.{out}'),
      );

      expect(match).toBeTruthy();
      match?.(captor);
      expect(captor).toHaveBeenCalledWith('capture', 'out', 'html', expect.anything());
    });
  });

  describe('{name}.{ext}', () => {
    it('captures file name and extension extension', () => {
      const match = routeMatch(
        urlRoute(new URL('http://localhost/file.html')),
        urlRoutePattern('{name}.{ext}'),
      );

      match?.(captor);
      expect(captor).toHaveBeenCalledWith('capture', 'name', 'file', expect.anything());
      expect(captor).toHaveBeenCalledWith('capture', 'ext', 'html', expect.anything());
      expect(captor).toHaveBeenCalledTimes(2);
    });
  });

  describe('dir/{(file)}', () => {
    it('captures file', () => {
      const match = routeMatch(
        urlRoute(new URL('http://localhost/dir/file')),
        urlRoutePattern('dir/{(file)}'),
      );

      match?.(captor);
      expect(captor).toHaveBeenCalledWith('regexp', 1, expect.anything(), expect.anything());
      expect([...captor.mock.calls[0][2]]).toEqual(['file']);
      expect(captor).toHaveBeenCalledTimes(1);
    });
  });

  describe('dir/{out(regexp)i}.txt', () => {
    it('captures file', () => {
      const match = routeMatch(
        urlRoute(new URL('http://localhost/dir/FILE.txt')),
        urlRoutePattern('dir/{out(\\w+)i}.txt'),
      );

      expect(match).toBeTruthy();
      match?.(captor);
      expect(captor).toHaveBeenCalledWith('regexp', 'out', expect.any(Array), expect.anything());
      expect([...captor.mock.calls[0][2]]).toEqual(['FILE']);
    });
  });
  describe('dir/{out(regexp(group))i}.txt', () => {
    it('captures file', () => {
      const match = routeMatch(
        urlRoute(new URL('http://localhost/dir/FILE.txt')),
        urlRoutePattern('dir/{out((fi)le)i}.txt'),
      );

      expect(match).toBeTruthy();
      match?.(captor);
      expect(captor).toHaveBeenCalledWith('regexp', 'out', expect.any(Array), expect.anything());
      expect([...captor.mock.calls[0][2]]).toEqual(['FILE', 'FI']);
    });
  });

  describe('{)(}', () => {
    it('captures file', () => {
      const match = routeMatch(urlRoute(new URL('http://localhost/test')), urlRoutePattern('{)(}'));

      expect(match).toBeTruthy();
      match?.(captor);
      expect(captor).toHaveBeenCalledWith('capture', ')(', 'test', expect.anything());
    });
  });

  describe('/', () => {
    it('matches empty route', () => {
      const match = routeMatch(urlRoute(new URL('http://localhost/')), urlRoutePattern('/'));

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
      match?.(captor);
      expect(captor).not.toHaveBeenCalled();
    });
  });

  describe('**?name', () => {
    const pattern = urlRoutePattern('**?name');

    it('matches URL with required parameter', () => {
      expect(
        routeMatch(urlRoute(new URL('http://localhost/path/to/file?name=value')), pattern),
      ).toBeTruthy();
    });
    it('does not match URL without required parameter', () => {
      expect(
        routeMatch(urlRoute(new URL('http://localhost/path/to/file?other=value')), pattern),
      ).toBeNull();
    });
  });
  describe('**?name=value', () => {
    const pattern = urlRoutePattern('**?name=value');

    it('matches URL with required parameter value', () => {
      expect(
        routeMatch(
          urlRoute(new URL('http://localhost/path/to/file?name=other&name=value')),
          pattern,
        ),
      ).toBeTruthy();
    });
    it('does not match URL wit wrong parameter value', () => {
      expect(
        routeMatch(urlRoute(new URL('http://localhost/path/to/file?name=wrong')), pattern),
      ).toBeNull();
    });
  });
});
