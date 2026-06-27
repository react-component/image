<div align="center">
  <h1>@rc-component/image</h1>
  <p><sub><img alt="Ant Design" height="14" src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" style="vertical-align: -0.125em;" /> Ant Design 生态的一部分。</sub></p>
  <p>🖼️ React 图片预览组件，支持预览组、缩放、旋转和自定义工具栏。</p>
</div>

<p align="center"><a href="./README.md">English</a> | 简体中文</p>


<div align="center">

[![NPM version][npm-image]][npm-url] [![npm download][download-image]][download-url] [![build status][github-actions-image]][github-actions-url] [![Codecov][codecov-image]][codecov-url] [![bundle size][bundlephobia-image]][bundlephobia-url] [![dumi][dumi-image]][dumi-url]

</div>

[npm-image]: https://img.shields.io/npm/v/@rc-component/image.svg?style=flat-square
[npm-url]: https://npmjs.org/package/@rc-component/image
[github-actions-image]: https://github.com/react-component/image/actions/workflows/react-component-ci.yml/badge.svg
[github-actions-url]: https://github.com/react-component/image/actions/workflows/react-component-ci.yml
[codecov-image]: https://img.shields.io/codecov/c/github/react-component/image/master.svg?style=flat-square
[codecov-url]: https://app.codecov.io/gh/react-component/image
[download-image]: https://img.shields.io/npm/dm/@rc-component/image.svg?style=flat-square
[download-url]: https://npmjs.org/package/@rc-component/image
[bundlephobia-image]: https://img.shields.io/bundlephobia/minzip/%40rc-component%2Fimage?style=flat-square
[bundlephobia-url]: https://bundlephobia.com/package/@rc-component/image
[dumi-image]: https://img.shields.io/badge/docs%20by-dumi-blue?style=flat-square
[dumi-url]: https://github.com/umijs/dumi

## 特性

- 支持占位符、后备和预览。
- 预览支持缩放、旋转、翻转、拖动、键盘访问和自定义操作。
- `Image.PreviewGroup` 支持分组预览和自定义预览项。
- 提供编译后的 JavaScript、TypeScript 类型定义和 CSS 资源。

## 安装

```bash
npm install @rc-component/image
```

## 使用

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

## 示例

```bash
npm install
npm start
```

然后打开 `http://localhost:8000`。

## API

### Image

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| fallback | 加载失败时使用的图片源 | string | - |
| placeholder | 图片加载前的占位内容 | boolean \| `React.ReactElement` | - |
| prefixCls | 组件className前缀 | string | `rc-image` |
| preview | 是否以及如何显示预览 | boolean \| `PreviewConfig` | true |
| previewPrefixCls | 预览className前缀 | string | `rc-image-preview` |
| src | Image source | string | - |
| onError | 图片加载失败时的回调 | `(event: Event) => void` | - |

也支持原生图片属性。

### PreviewConfig

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| actionsRender | 自定义工具栏渲染器 | `(node: React.ReactElement, info: Omit<ToolbarRenderInfoType, 'current' \| 'total'>) => React.ReactNode` | - |
| closeIcon | 自定义关闭图标 | `React.ReactNode` | - |
| cover | 自定义预览封面 | `React.ReactNode \| CoverConfig` | - |
| countRender | 自定义计数渲染器 | `(current: number, total: number) => React.ReactNode` | - |
| forceRender | 强制渲染预览 | boolean | false |
| getContainer | 预览容器 | string \| HTMLElement \| `() => HTMLElement` \| false | `document.body` |
| imageRender | 自定义图像渲染器 | `(node: React.ReactElement, info: { transform: TransformType; image: ImgInfo }) => React.ReactNode` | - |
| maskClosable | 单击蒙版是否关闭预览 | boolean | true |
| maxScale | Max scale | number | 50 |
| minScale | Min scale | number | 1 |
| movable | 启用拖动 | boolean | true |
| 打开 | 受控预览打开状态 | boolean | - |
| scaleStep | Scale step | number | 0.5 |
| src | 自定义预览图像源 | string | - |
| onOpenChange | 预览打开状态变化时回调 | `(open: boolean) => void` | - |
| onTransform | 变换变化时的回调 | `(info: { transform: TransformType; action: TransformAction }) => void` | - |

### Image.PreviewGroup

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| children们 | 儿童形象 | `React.ReactNode` | - |
| classNames | 语义预览弹层className称 | `{ popup?: Partial<Record<PreviewSemanticName, string>> }` | - |
| fallback | 加载失败时使用的图片源 | string | - |
| icons | 自定义预览操作图标 | `PreviewProps['icons']` | - |
| 项目 | 预览项目 | `(string \| ImageElementProps)[]` | - |
| preview | 是否以及如何显示预览 group | boolean \| `GroupPreviewConfig` | true |
| previewPrefixCls | 预览className前缀 | string | `rc-image-preview` |
| styles | 语义预览弹层样式 | `{ popup?: Partial<Record<PreviewSemanticName, React.CSSProperties>> }` | - |

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

## 本地开发

```bash
npm install
npm start
```

```bash
npm test
npm run tsc
npm run lint
npm run compile
npm run build
```

## 发布

```bash
npm run prepublishOnly
```

包构建完成后，发布流程由 `@rc-component/np` 通过 `rc-np` 命令处理。

## 许可证

@rc-component/image 基于 [MIT](./LICENSE.md) 许可证发布。
