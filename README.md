# rc-image

---

React Image

[![NPM version][npm-image]][npm-url] [![build status][travis-image]][travis-url] [![Test coverage][coveralls-image]][coveralls-url] [![gemnasium deps][gemnasium-image]][gemnasium-url] [![npm download][download-image]][download-url]

[npm-image]: http://img.shields.io/npm/v/rc-image.svg?style=flat-square
[npm-url]: http://npmjs.org/package/rc-image
[travis-image]: https://img.shields.io/travis/react-component/image.svg?style=flat-square
[travis-url]: https://travis-ci.org/react-component/image
[coveralls-image]: https://img.shields.io/coveralls/react-component/image.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/react-component/img?branch=master
[gemnasium-image]: http://img.shields.io/gemnasium/react-component/img.svg?style=flat-square
[gemnasium-url]: https://gemnasium.com/react-component/img
[node-image]: https://img.shields.io/badge/node.js-%3E=_0.10-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/rc-image.svg?style=flat-square
[download-url]: https://npmjs.org/package/rc-image

## Feature

- [x] Placeholder
- [x] Preview
- [x] Rotate
- [x] Zoom
- [x] Fallback

### Keyboard

## install

[![rc-image](https://nodei.co/npm/rc-image.png)](https://npmjs.org/package/rc-image)

## Usage

```bash
npm install
npm start
```

```jsx
const Image = require('rc-image');

ReactDOM.render(
  <Image src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />
), document.getElementById('root'));
```

## API

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| preview | boolean | true | Whether to show preview |
| prefixCls | string | rc-image | Classname prefix |
| placeholder | boolean \| ReactElement | - | if `true` will set default placeholder or use `ReactElement` set customize placeholder |
| fallback | string | - | Load failed src |
| onPreviewClose | function(e) | - | Preview close callback |
| previewPrefixCls | string | rc-image-preview | Preview classname prefix |

## Example

http://localhost:8003/examples/

## Test Case

```
npm test
```

## Coverage

```
npm run coverage
```

## License

rc-image is released under the MIT license.
