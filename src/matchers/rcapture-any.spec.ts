import { routeMatch, RoutePattern } from '../route-match';
import { urlRoute } from '../url';
import { rcaptureAny } from './rcapture-any';
import { rmatchAny } from './rmatch-any';
import { rmatchDirSep } from './rmatch-dir-sep';
import { rmatchString } from './rmatch-string';

describe('rcaptureAny', () => {

  let cb: jest.Mock;

  beforeEach(() => {
    cb = jest.fn();
  });

  describe('{capture}', () => {

    let pattern: RoutePattern;

    beforeEach(() => {
      pattern = [rcaptureAny('out')];
    });

    it('does not match empty route', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/')), pattern)).toBeNull();
    });
    it('matches file', () => {

      const match = routeMatch(urlRoute(new URL('http://localhost/file')), pattern);

      match?.(cb);
      expect(cb).toHaveBeenCalledWith('capture', 'out', 'file', expect.anything());
    });
    it('matches directory', () => {

      const match = routeMatch(urlRoute(new URL('http://localhost/dir/')), pattern);

      match?.(cb);
      expect(cb).toHaveBeenCalledWith('capture', 'out', 'dir', expect.anything());
    });
    it('does not match multiple entries', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/dir/file')), pattern)).toBeNull();
    });
  });

  describe('{capture}/*', () => {

    let pattern: RoutePattern;

    beforeEach(() => {
      pattern = [rcaptureAny('out'), rmatchDirSep, rmatchAny];
    });

    it('matches two entries', () => {

      const match = routeMatch(urlRoute(new URL('http://localhost/dir/file')), pattern);

      match?.(cb);
      expect(cb).toHaveBeenCalledWith('capture', 'out', 'dir', expect.anything());
    });
  });

  describe('*/{capture}', () => {

    let pattern: RoutePattern;

    beforeEach(() => {
      pattern = [rmatchAny, rmatchDirSep, rcaptureAny('out')];
    });

    it('matches two entries', () => {

      const match = routeMatch(urlRoute(new URL('http://localhost/dir/file')), pattern);

      match?.(cb);
      expect(cb).toHaveBeenCalledWith('capture', 'out', 'file', expect.anything());
    });
  });

  describe('<string>{capture}', () => {

    let pattern: RoutePattern;

    beforeEach(() => {
      pattern = [rmatchString('page-'), rcaptureAny('out')];
    });

    it('matches file', () => {

      const match = routeMatch(urlRoute(new URL('http://localhost/page-1')), pattern);

      match?.(cb);
      expect(cb).toHaveBeenCalledWith('capture', 'out', '1', expect.anything());
    });
    it('does not match file with wrong prefix', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/page1')), pattern)).toBeNull();
    });
  });

  describe('{capture}<string>', () => {

    let pattern: RoutePattern;

    beforeEach(() => {
      pattern = [rcaptureAny('out'), rmatchString('.html')];
    });

    it('matches file', () => {

      const match = routeMatch(urlRoute(new URL('http://localhost/index.html')), pattern);

      match?.(cb);
      expect(cb).toHaveBeenCalledWith('capture', 'out', 'index', expect.anything());
    });
    it('does not match file with wrong suffix', () => {
      expect(routeMatch(urlRoute(new URL('http://localhost/index.htm')), pattern)).toBeNull();
    });
  });
});
