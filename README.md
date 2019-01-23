# rc-image
---

React Image

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![gemnasium deps][gemnasium-image]][gemnasium-url]
[![npm download][download-image]][download-url]

[npm-image]: http://img.shields.io/npm/v/rc-image.svg?style=flat-square
[npm-url]: http://npmjs.org/package/rc-image
[travis-image]: https://img.shields.io/travis/react-component/image.svg?style=flat-square
[travis-url]: https://travis-ci.org/react-componentimage/
[coveralls-image]: https://img.shields.io/coveralls/react-component/image.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/react-component/image?branch=master
[gemnasium-image]: http://img.shields.io/gemnasium/react-component/image.svg?style=flat-square
[gemnasium-url]: https://gemnasium.com/react-componentimage/
[node-image]: https://img.shields.io/badge/node.js-%3E=_0.10-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/rc-image.svg?style=flat-square
[download-url]: https://npmjs.org/package/rc-image

## Screenshots


## Feature
- [x] Error image display
- [x] Responsive
- [ ] PreviewImage
- [ ] Placeholder
- [ ] rotate
- [ ] cropping
- [ ] filter



### Keyboard


## install


## Usage

### basic use

### preview Image

```jsx
const handlePreview = () => {
  this.setState({
    preview: true,
  });
}

<div className="mask">
  <Image preview={this.state.preview}  />
  <Icon type="view" onClick={this.handlePreview} />
  <Icon type="delete" />
</div>

```

## API

### Image props

### Methods

## Development

```
npm install
npm start
```

## Example

http://localhost:8003/examples/

online example: http://react-component.github.io/image/examples/

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
