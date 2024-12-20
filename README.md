# Route Matching Library

[![NPM][npm-image]][npm-url]
[![Build Status][build-status-img]][build-status-link]
[![Code Quality][quality-img]][quality-link]
[![Coverage][coverage-img]][coverage-link]
[![GitHub Project][github-image]][github-url]
[![API Documentation][api-docs-image]][api-docs-url]

[npm-image]: https://img.shields.io/npm/v/@hatsy/route-match.svg?logo=npm
[npm-url]: https://www.npmjs.com/package/@hatsy/route-match
[build-status-img]: https://github.com/hatsyjs/route-match/workflows/Build/badge.svg
[build-status-link]: https://github.com/hatsyjs/route-match/actions?query=workflow:Build
[quality-img]: https://app.codacy.com/project/badge/Grade/92a111914d734952aef56d14e2690940
[quality-link]: https://app.codacy.com/gh/hatsyjs/route-match/dashboard?utm_source=gh&utm_medium=referral&utm_content=hatsyjs/route-match&utm_campaign=Badge_Grade
[coverage-img]: https://app.codacy.com/project/badge/Coverage/92a111914d734952aef56d14e2690940
[coverage-link]: https://app.codacy.com/gh/hatsyjs/route-match/dashboard?utm_source=gh&utm_medium=referral&utm_content=hatsyjs/route-match&utm_campaign=Badge_Coverage
[github-image]: https://img.shields.io/static/v1?logo=github&label=GitHub&message=project&color=informational
[github-url]: https://github.com/hatsyjs/route-match
[api-docs-image]: https://img.shields.io/static/v1?logo=typescript&label=API&message=docs&color=informational
[api-docs-url]: https://hatsyjs.github.io/route-match/

## Simple Pattern

```typescript
import { matchSimpleRoute } from '@hatsy/route-match';

const match = matchSimpleRoute('some/long/path/to/file.txt', 'some/**/{file}');
/*
match = {
  $1: "long/path/to/",
  file: "file.txt",
}
*/
```

Simple pattern can only match against whole entries (files or directories). Pattern format:

- Empty string corresponds to empty pattern.
- `/` matches directory separator.
- `/*` matches any route entry.
- `/{capture}` captures any route entry as `capture`.
- `/**` matches any number of directories.
- `/{capture:**}` captures any number of directories as `capture`.
- Everything else matches verbatim.

The path can be specified as a string, as URL, or as a [PathRoute] instance. The latter can be constructed by
[urlRoute()] function.

The pattern can be specified as a string, or as a [RoutePattern] instance. The latter can be constructed by
[simpleRoutePattern()] function.

[PathRoute]: https://hatsyjs.github.io/route-match/interfaces/PathRoute.html
[urlRoute()]: https://hatsyjs.github.io/route-match/functions/urlRoute-1.html
[RoutePattern]: https://hatsyjs.github.io/route-match/types/RoutePattern.html
[simpleRoutePattern()]: https://hatsyjs.github.io/route-match/functions/simpleRoutePattern.html

## URL Route

[url route]: #url-route

```typescript
import { matchURLRoute } from '@hatsy/route-match';

const match = matchURLRoute('some-dir/long/path/to/file.html?param=value', '{root([^-]*)}-dir/**/{name}.{ext}?param');
/*
match = {
  root: "some",
  $1: "long/path/to/",
  name: "file",
  ext: "txt",
}
*/
```

URL pattern can match against any part of the entry name. Additionally, it can match against URL search parameters.

Pattern format:

- Empty string corresponds to empty pattern.
- `/` matches directory separator.
- `*` matches a part of route entry name.
- `{capture}` captures a part of entry name as `capture`.
- `/**` matches any number of directories.
- `/{capture:**}` captures any number of directories as `capture`.
- `{(regexp)flags}` matches a part of entry name matching the given regular expression with optional flags.
- `{capture(regexp)flags}` captures a part of entry name matching the regular expression with optional flags.
- `?name` requires URL search parameter to present.
- `?name=value` requires URL search parameter to have the given value.
- Everything else matches verbatim.

The path can be specified as a string, as URL, or as an [URLRoute] instance. The latter can be constructed by
[urlRoute()] function.

The pattern can be specified as a string, or as a [RoutePattern] instance. The latter can be constructed by
[urlRoutePattern()] function.

[URLRoute]: https://hatsyjs.github.io/route-match/interfaces/URLRoute.html
[urlRoutePattern()]: https://hatsyjs.github.io/route-match/functions/urlRoutePattern.html

## Matrix Route

```typescript
import { matchMatrixRoute } from '@hatsy/route-match';

const match = matchMatrixRoute('root;length=5/long/path/to;dir=1/file.html;dir=0', 'root;length/**/*');
/*
match = {
  $1: "long/path/to;dir=1/",
  name: "file",
  ext: "html",
}
*/
```

Matrix pattern recognizes [matrix URI]s.

Pattern format is the same as for [URL Route] with addition of attribute matchers:

- `;name` requires matrix attribute to present.
- `;name=value` requires matrix attribute to have the given value.

The path can be specified as a string, as URL, or as a [MatrixRoute] instance. The latter can be constructed by
[matrixRoute()] function.

The pattern can be specified as a string, or as a [RoutePattern] instance. The latter can be constructed by
[matrixRoutePattern()] function.

[MatrixRoute]: https://hatsyjs.github.io/route-match/interfaces/MatrixRoute.html
[matrixRoute()]: https://hatsyjs.github.io/route-match/functions/matrixRoute-1.html
[matrixRoutePattern()]: https://hatsyjs.github.io/route-match/functions/matrixRoutePattern.html
[matrix URI]: https://www.w3.org/DesignIssues/MatrixURIs.html

## Advanced Usage

The library supports different route formats mentioned above. Each format represents the route as an array of entries
plus additional info. The route can be constructed either manually or parsed by corresponding function.

All routes extend [PathRoute] interface with the following methods:

- `section(fromEntry[, toEntry])` returns a section of the route.
- `toString()` converts a route to original string, including search parameters and matrix attributes.
- `toPathString()` converts a route to path string, excluding search parameters and matrix attributes.

A route pattern is an array of [RouteMatcher]s compatible with corresponding route format. Route pattern can be
constructed out of `rmatch...` and `rcapture...` matchers, or parsed by corresponding function.

The [routeMatch()] function does the actual matching. It returns either `null` if the given path does not match
the pattern, or a [RouteMatch] instance. The latter is a function that reports captured matches when called.

[RouteMatcher]: https://hatsyjs.github.io/route-match/interfaces/RouteMatcher-1.html
[routeMatch()]: https://hatsyjs.github.io/route-match/functions/routeMatch-2.html
[RouteMatch]: https://hatsyjs.github.io/route-match/types/RouteMatch-1.html
