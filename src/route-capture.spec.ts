import { describe, expect, it } from '@jest/globals';
import {
  rcaptureDirs,
  rcaptureEntry,
  rcaptureRegExp,
  rmatchDirs,
  rmatchDirSep,
  rmatchEntry,
  rmatchName,
} from './matchers';
import { routeCapture } from './route-capture';
import { routeMatch } from './route-match';
import { urlRoute } from './url';

describe('routeCapture', () => {
  it('extracts capture under its name', () => {
    expect(routeCapture(routeMatch(urlRoute('test'), [rcaptureEntry('entry')])!)).toEqual({
      entry: 'test',
    });
  });
  it('extracts anonymous capture under its index', () => {
    expect(
      routeCapture(routeMatch(urlRoute('dir/file'), [rmatchEntry, rmatchDirSep, rmatchEntry])!),
    ).toEqual({ $1: 'dir', $2: 'file' });
  });
  it('extracts regexp capture and match groups', () => {
    expect(
      routeCapture(routeMatch(urlRoute('test.html'), [rcaptureRegExp(/(.+)\.(.+)/, 're')])!),
    ).toEqual({ re: 'test.html', re$1: 'test', re$2: 'html' });
  });
  it('extracts named regexp groups', () => {
    expect(
      routeCapture(routeMatch(urlRoute('test.html'), [rcaptureRegExp(/(?<name>.+)\.(?<ext>.+)/)])!),
    ).toEqual({ $1: 'test.html', $1$1: 'test', $1$2: 'html', name: 'test', ext: 'html' });
  });
  it('extracts matching route tail', () => {
    expect(
      routeCapture(
        routeMatch(urlRoute('path/to/file.txt?param=value'), [
          rmatchName('path'),
          rmatchDirSep,
          rcaptureDirs('tail'),
        ])!,
      ),
    ).toEqual({ tail: 'to/file.txt?param=value' });
  });
  it('extracts matching dirs', () => {
    expect(
      routeCapture(
        routeMatch(urlRoute('path/to/file.txt?param=value'), [rmatchDirs, rmatchName('file.txt')])!,
      ),
    ).toEqual({ $1: 'path/to/' });
  });
  it('extracts unknown capture as string value', () => {
    expect(
      routeCapture(captor => {
        captor('unknown' as any, 'test', 'test-value');
      }),
    ).toEqual({ test: 'test-value' });
  });
});
