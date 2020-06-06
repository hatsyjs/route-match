import { routeTail } from './route-tail';
import { urlRoute } from './url';

describe('routeTail', () => {
  describe('of empty route', () => {
    it('is a route itself', () => {

      const route = urlRoute(new URL('route:/'));

      expect(routeTail(route, 1)).toBe(route);
    });
  });

  describe('starting from negative entry index', () => {
    it('is a route itself', () => {

      const route = urlRoute(new URL('route:/some/path'));

      expect(routeTail(route, -1)).toBe(route);
    });
  });

  describe('starting from zero entry index', () => {
    it('is a route itself', () => {

      const route = urlRoute(new URL('route:/some/path'));

      expect(routeTail(route, 0)).toBe(route);
    });
  });

  describe('staring after the last entry', () => {
    it('is empty directory route', () => {

      const route = urlRoute(new URL('route:/some/path'));

      expect(routeTail(route, route.path.length)).toEqual({
        ...route,
        path: [],
        dir: true,
      });
    });
  });

  describe('of directory route', () => {
    it('is tail directory route', () => {

      const route = urlRoute(new URL('route:/some/path/'));

      expect(routeTail(route, 1)).toEqual({
        ...route,
        path: [{ name: 'path' }],
        dir: true,
      });
    });
  });

  describe('of file route', () => {
    it('is tail file route', () => {

      const route = urlRoute(new URL('route:/some/path'));

      expect(routeTail(route, 1)).toEqual({
        ...route,
        path: [{ name: 'path' }],
        dir: false,
      });
    });
  });

  describe('toString', () => {
    it('represents route tail', () => {
      expect(String(routeTail(urlRoute(new URL('route:/some/path/?name=value')), 1))).toEqual('path/?name=value');
    });
  });
});
