> IVAN is no longer maintained. Feel free pick it and maintain it yourself if you like, or check out my newest project [html-bricks](https://github.com/gustavgb/html-bricks).

# IVAN &middot; [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![codebeat badge](https://codebeat.co/badges/6dea7e2f-d6cb-4bd8-9689-971f97e98f37)](https://codebeat.co/projects/github-com-gustavgb-ivan-master) [![npm version](https://badge.fury.io/js/%40gustavgb%2Fivan.svg)](https://badge.fury.io/js/%40gustavgb%2Fivan)

A simple markup language that compiles to static HTML, CSS and JS. Read more at [the website](https://ivan-lang.netlify.com/).

## Use from command line

`ivan build --src path/to/src`

or

`ivan watch --src path/to/src`

or

`ivan help`, which is equal to `ivan --help`

In the first two cases, *--src* can be excluded, in which case the source defaults to "src" *(path/to/project/**src**)*.

## Use with node

```
import 'ivan' from '@gustavgb/ivan'

ivan(options)
```

Options are:

* src: path to the source directory (equivalent to *--src*)

* watch: boolean determing whether or not a file watcher starts after initial compilation (equivalent to *ivan watch*)
