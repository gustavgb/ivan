# ivan-dev-server

Compile and serve your website at the same time. Only works, when [ivan](https://www.npmjs.com/package/@gustavgb/ivan) is installed.

## Use from command line

`ivan-dev-server --src path/to/src`

or

`ivan-dev-server help`, which is equal to `ivan-dev-server --help`

The *--src* flag can be excluded, in which case the source defaults to "src" *(path/to/project/**src**)*.

## Use with node

```
import 'server' from '@gustavgb/ivan-dev-server'

server(sourceDir, port)
```

*port* can be excluded, in which case the server defaults to port 3000.

## Further reading

More info is coming soon on the website. Visit [ivan.gustavgb.com](https://ivan.gustavgb.com).
