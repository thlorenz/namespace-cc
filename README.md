# namespace-cc

Namespaces C++ files according to directory structure

```
Usage: namespace-cc <full-path-to-dir> '<space-separated-namespaced>'
```

## Installation

    npm install namespace-cc

## Examples

**Original**

```cc
#ifndef RAPIDJSON_PARSER
#define RAPIDJSON_PARSER

class RapidJsonParser {
  public:
    RapidJsonParser(const char* json);
};

#endif
```

**Run**: `namespace-cc ./mydir 'outer inner'`

**Result**

```cc
#ifndef RAPIDJSON_PARSER
#define RAPIDJSON_PARSER

namespace outer {
namespace inner {

class RapidJsonParser {
  public:
    RapidJsonParser(const char* json);
};

}
}
#endif
```


## [API](https://thlorenz.github.io/namespace-cc)

## Requirements

Node.js >= v8 (sorry, wanted to play with `async/await`).

## License

MIT
