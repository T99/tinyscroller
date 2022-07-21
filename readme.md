# <img align="left" height="35" src="assets/tinyscroller.svg"> Tinyscroller

An absolutely abnormally abysmally small image scroller.

### [Find tinyscroller on NPM.](https://www.npmjs.com/package/tinyscroller)

## Table of Contents

- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [Documentation](#documentation)
- [License](#license)

## Installation

Install from NPM with

```
$ npm install --save tinyscroller
```

## Basic Usage

A new Tinyscroller instance can be initialized using the
`new Tinyscroller(target)` constructor:

```javascript
// By using a CSS selector:
let tinyscroller = new Tinyscroller(".container > div");

// Or by using a pre-fetched DOM node:
let element = document.getElementById("my-tinyscroller-container");
let tinyscroller = new Tinyscroller(element);
```

Tinyscroller comes with a couple of basic options for customization using the `new Tinyscroller(target, options)` constructor:

```javascript
let tinyscroller = new Tinyscroller(target, {
	orientation: "horizontal",
	fit: "cover",
	progress: true,
	arrows: false,
});
```

| Option        | Type                                     | Default        | Description                                                                                               |
|---------------|------------------------------------------|----------------|-----------------------------------------------------------------------------------------------------------|
| `orientation` | `"vertical" \| "horizontal"`         | `"horizontal"` | The axis along which images are displayed in this scroller.                                               |
| `fit`         | `"contain" \| "cover" \| "fill"` | `"cover"`      | The method by which images fill their containers if their aspect ratio does not match the container size. |
| `progress`    | `boolean`                                | `true`         | Whether or not progress dots should be overlayed on top of the slider.                                    |
| `arrows`      | `boolean`                                | `true`         | Whether or not next/last navigation arrows should be overlayed on top of the slider.                      |

## Example

<p align="center">
	<img src="assets/tinyscroller-example-1.png">
</p>

## License

tinyscroller is made available under the GNU General Public License v3.

Copyright (C) 2022 Trevor Sears
