# webpack-bundle-diff

Webpack-bundle-diff is a tool for understanding changes to your webpack bundles.  Because a single import can cause a whole tree of downstream dependencies to get pulled into a bundle, it is possible for a seemingly innocuous change to have a large effect on your bundle size.  And when some module *does* get unexpectedly included in your bundle, it can be hard to understand specifically what code change caused it.  By comparing the webpack stats from before and after a change, webpack-bundle-diff helps you understand the change's precise impact.

## Getting started

1. Install: `npm install -g webpack-bundle-diff`
2. Produce webpack stats files: `webpack --json > stats.json`
3. Diff: `wbd diff stats1.json stats2.json -o diff.json`
4. Report: `wbd report diff.json -o report.md`

## Named chunk groups

Diff information is only reported for **named chunk groups**.  Be sure to provide a name for every entry point or code split point that you want analyzed.  For example, to configure to entry points named `home` and `about` your webpack config might look like:

```typescript
{
    entry: {
        home: "./home.js",
        about: "./about.js"
    }
}
```

To provide a name for a dynamically imported bundle, include the `webpackChunkName` magic comment:

```typescript
import(/* webpackChunkName: "lodash" */ 'lodash');
```

## Commands

### **wbd data \<stats file\> -o \<output file\>**

Generates a bundle data JSON file that can be passed to `wbd diff`.  Webpack stats files can be huge, with lots of redundant or unnecessary information.  A bundle data file contains just the information needed for webpack-bundle-diff to do its work at a tiny fraction of the size.  While you can work with webpack stats files directly, you may find it preferable to store bundle data files for the reduced read/write time and space requirements.

### **wbd diff \<baseline stats file\> \<comparison stats file\> -o \<output file\>**

Generates a JSON file containing detailed information about the diff.  The provided stats files can be the raw webpack stats or bundle data files produced with `wbd data`.

### **wbd report \<diff file\> -o \<output file\>**

Produces a human-readable summary of the provided diff in markdown format.

## API

Webpack-bundle-diff can also be run programmatically via the API:

```typescript
import { diff, generateReport } from 'webpack-bundle-diff';

let diff = diff(stats1, stats2);
let report = generateReport(diff);
```
