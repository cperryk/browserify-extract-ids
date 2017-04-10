# browserify-extract-ids

Browserify plugin to export a bundle's module IDs.

## Installation

`npm install browserify-extract-ids --save`

## Usage

```
// main.js
require('./a');
require('./b');
```

```
// a.js
require('c');
```

```
// b.js
console.log('do nothing!');
```

```
// c.js
console.log('do nothing!');
```

```
const extractIds = require('browserify-extract-ids');

browserify()
  .add('./main.js')
  .plugin(extractIds, {
    outputFile: './ids.json'
  });
```

This will result in a `ids.json` like the following. (Note: Browserify assigns modules numeric IDs.)

```
{
  '/some/filepath/a.js': 1,
  '/some/filepath/b.js': 2,
  '/some/filepath/c.js': 3,
  '/some/filepath/main.js': 4
}
```
