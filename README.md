<div align="center">
  <h1>@rc-component/image</h1>
  <p><sub><a href="https://ant.design"><img alt="Ant Design" height="14" src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" style="vertical-align: -0.125em;" /></a> Part of the Ant Design ecosystem.</sub></p>
  <p>🖼️ Image display, fallback, and preview tooling for React.</p>

  <p>
    <a href="https://npmjs.org/package/@rc-component/image"><img alt="NPM version" src="https://img.shields.io/npm/v/@rc-component/image.svg?style=flat-square"></a>
    <a href="https://npmjs.org/package/@rc-component/image"><img alt="npm downloads" src="https://img.shields.io/npm/dm/@rc-component/image.svg?style=flat-square"></a>
    <a href="https://github.com/react-component/image/actions/workflows/react-component-ci.yml"><img alt="build status" src="https://github.com/react-component/image/actions/workflows/react-component-ci.yml/badge.svg"></a>
    <a href="https://app.codecov.io/gh/react-component/image"><img alt="Codecov" src="https://img.shields.io/codecov/c/github/react-component/image/master.svg?style=flat-square"></a>
    <a href="https://bundlephobia.com/package/@rc-component/image"><img alt="bundle size" src="https://img.shields.io/bundlephobia/minzip/@rc-component/image?style=flat-square"></a>
    <a href="https://github.com/umijs/dumi"><img alt="dumi" src="https://img.shields.io/badge/docs%20by-dumi-blue?style=flat-square"></a>
  </p>
</div>

<p align="center">English | <a href="./README.zh-CN.md">简体中文</a></p>

## Highlights

- Supports placeholder, fallback, and preview.
- Preview supports zoom, rotate, flip, drag, keyboard access, and custom actions.
- `Image.PreviewGroup` supports grouped preview and custom preview items.
- Ships compiled JavaScript, TypeScript definitions, and CSS assets.

## Install

```bash
npm install @rc-component/image
```

## Usage

```tsx | pure
import Image from '@rc-component/image';
import '@rc-component/image/assets/index.css';

export default function App() {
  return (
    <Image src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />
  );
}
```

## Preview Group

```tsx | pure
import Image from '@rc-component/image';
import '@rc-component/image/assets/index.css';

export default function App() {
  return (
    <Image.PreviewGroup>
      <Image src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />
      <Image src="https://gw.alipayobjects.com/mdn/rms_08e378/afts/img/A*P0S-QIRUbsUAAAAAAAAAAABkARQnAQ" />
    </Image.PreviewGroup>
  );
}
```

## Examples

Run the local dumi site:

```bash
npm install
npm start
```

Then open `http://localhost:8000`.

## API

### Image

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| fallback | Image source used when loading fails | string | - |
| placeholder | Placeholder before image loads | boolean \| `React.ReactElement` | - |
| prefixCls | Component class name prefix | string | `rc-image` |
| preview | Whether and how to show preview | boolean \| `PreviewConfig` | true |
| previewPrefixCls | Preview class name prefix | string | `rc-image-preview` |
| src | Image source | string | - |
| onError | Callback when image loading fails | `(event: Event) => void` | - |

Native image attributes are also supported.

### PreviewConfig

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| actionsRender | Custom toolbar renderer | `(node: React.ReactElement, info: Omit<ToolbarRenderInfoType, 'current' \| 'total'>) => React.ReactNode` | - |
| closeIcon | Custom close icon | `React.ReactNode` | - |
| cover | Custom preview cover | `React.ReactNode \| CoverConfig` | - |
| countRender | Custom count renderer | `(current: number, total: number) => React.ReactNode` | - |
| forceRender | Force render preview | boolean | false |
| getContainer | Preview container | string \| HTMLElement \| `() => HTMLElement` \| false | `document.body` |
| imageRender | Custom image renderer | `(node: React.ReactElement, info: { transform: TransformType; image: ImgInfo }) => React.ReactNode` | - |
| maskClosable | Whether clicking mask closes preview | boolean | true |
| maxScale | Max scale | number | 50 |
| minScale | Min scale | number | 1 |
| movable | Enable drag | boolean | true |
| open | Controlled preview open state | boolean | - |
| scaleStep | Scale step | number | 0.5 |
| src | Custom preview image source | string | - |
| onOpenChange | Callback when preview open state changes | `(open: boolean) => void` | - |
| onTransform | Callback when transform changes | `(info: { transform: TransformType; action: TransformAction }) => void` | - |

### Image.PreviewGroup

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| children | Image children | `React.ReactNode` | - |
| classNames | Semantic preview popup class names | `{ popup?: Partial<Record<PreviewSemanticName, string>> }` | - |
| fallback | Image source used when loading fails | string | - |
| icons | Custom preview operation icons | `PreviewProps['icons']` | - |
| items | Preview items | `(string \| ImageElementProps)[]` | - |
| preview | Whether and how to show preview group | boolean \| `GroupPreviewConfig` | true |
| previewPrefixCls | Preview class name prefix | string | `rc-image-preview` |
| styles | Semantic preview popup styles | `{ popup?: Partial<Record<PreviewSemanticName, React.CSSProperties>> }` | - |

### TransformType

```ts
type TransformType = {
  x: number;
  y: number;
  rotate: number;
  scale: number;
  flipX: boolean;
  flipY: boolean;
};

type TransformAction =
  | 'flipY'
  | 'flipX'
  | 'rotateLeft'
  | 'rotateRight'
  | 'zoomIn'
  | 'zoomOut'
  | 'close'
  | 'prev'
  | 'next'
  | 'wheel'
  | 'doubleClick'
  | 'move'
  | 'dragRebound';

type Actions = {
  onActive: (offset: number) => void;
  onFlipY: () => void;
  onFlipX: () => void;
  onRotateLeft: () => void;
  onRotateRight: () => void;
  onZoomOut: () => void;
  onZoomIn: () => void;
  onClose: () => void;
  onReset: () => void;
};

type ToolbarRenderInfoType = {
  icons: {
    prevIcon?: React.ReactNode;
    nextIcon?: React.ReactNode;
    flipYIcon: React.ReactNode;
    flipXIcon: React.ReactNode;
    rotateLeftIcon: React.ReactNode;
    rotateRightIcon: React.ReactNode;
    zoomOutIcon: React.ReactNode;
    zoomInIcon: React.ReactNode;
  };
  actions: Actions;
  transform: TransformType;
  current: number;
  total: number;
  image: ImgInfo;
};
```

## Development

```bash
npm install
npm start
```

The dumi site runs at `http://localhost:8000` by default.

```bash
npm test
npm run tsc
npm run lint
npm run compile
npm run build
```

## Release

```bash
npm run prepublishOnly
```

The release flow is handled by `@rc-component/np` through the `rc-np` command after the package build.

## License

@rc-component/image is released under the [MIT](./LICENSE) license.
