# ivan

A simple markup language that compiles to static HTML, CSS and JS. Read more at [the website](https://ivan.gustavgb.com).

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

## Further reading

More info is coming soon on the website. Visit [ivan.gustavgb.com](https://ivan.gustavgb.com).
