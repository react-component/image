import { clsx } from 'clsx';
import * as React from 'react';
import type { Actions, PreviewProps } from '.';
import type { ImgInfo } from '../Image';
import type { TransformType } from '../hooks/useImageTransform';

export type FooterSemanticName = 'footer' | 'actions';

type OperationType =
  | 'prev'
  | 'next'
  | 'flipY'
  | 'flipX'
  | 'rotateLeft'
  | 'rotateRight'
  | 'zoomOut'
  | 'zoomIn';

interface RenderOperationParams {
  icon: React.ReactNode;
  type: OperationType;
  disabled?: boolean;
  onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

export interface FooterProps extends Actions {
  prefixCls: string;
  showProgress: boolean;
  countRender?: PreviewProps['countRender'];
  actionsRender?: PreviewProps['actionsRender'];
  current: number;
  count: number;
  showSwitch: boolean;
  icons: PreviewProps['icons'];
  scale: number;
  minScale: number;
  maxScale: number;
  image: ImgInfo;
  transform: TransformType;

  // Style
  classNames: Partial<Record<FooterSemanticName, string>>;
  styles: Partial<Record<FooterSemanticName, React.CSSProperties>>;
}

export default function Footer(props: FooterProps) {
  // 修改解构，添加缺失的属性，并提供默认值
  const {
    prefixCls,
    showProgress,
    current,
    count,
    showSwitch,

    // Style
    classNames,
    styles,

    // render
    icons,
    image,
    transform,
    countRender,
    actionsRender,

    // Scale
    scale,
    minScale,
    maxScale,

    // Actions
    onActive,
    onFlipY,
    onFlipX,
    onRotateLeft,
    onRotateRight,
    onZoomOut,
    onZoomIn,
    onClose,
    onReset,
  } = props;

  const { left, right, prev, next, flipY, flipX, rotateLeft, rotateRight, zoomOut, zoomIn } = icons;

  // ========================== Render ==========================
  // >>>>> Progress
  const progressNode = showProgress && (
    <div className={`${prefixCls}-progress`}>
      {countRender ? countRender(current + 1, count) : <bdi>{`${current + 1} / ${count}`}</bdi>}
    </div>
  );

  // >>>>> Actions
  const actionCls = `${prefixCls}-actions-action`;

  const renderOperation = ({ type, disabled, onClick, icon }: RenderOperationParams) => {
    return (
      <div
        key={type}
        className={clsx(actionCls, `${actionCls}-${type}`, {
          [`${actionCls}-disabled`]: !!disabled,
        })}
        onClick={onClick}
      >
        {icon}
      </div>
    );
  };

  const switchPrevNode = showSwitch
    ? renderOperation({
        icon: prev ?? left,
        onClick: () => onActive(-1),
        type: 'prev',
        disabled: current === 0,
      })
    : undefined;

  const switchNextNode = showSwitch
    ? renderOperation({
        icon: next ?? right,
        onClick: () => onActive(1),
        type: 'next',
        disabled: current === count - 1,
      })
    : undefined;

  const flipYNode = renderOperation({
    icon: flipY,
    onClick: onFlipY,
    type: 'flipY',
  });

  const flipXNode = renderOperation({
    icon: flipX,
    onClick: onFlipX,
    type: 'flipX',
  });

  const rotateLeftNode = renderOperation({
    icon: rotateLeft,
    onClick: onRotateLeft,
    type: 'rotateLeft',
  });

  const rotateRightNode = renderOperation({
    icon: rotateRight,
    onClick: onRotateRight,
    type: 'rotateRight',
  });

  const zoomOutNode = renderOperation({
    icon: zoomOut,
    onClick: onZoomOut,
    type: 'zoomOut',
    disabled: scale <= minScale,
  });

  const zoomInNode = renderOperation({
    icon: zoomIn,
    onClick: onZoomIn,
    type: 'zoomIn',
    disabled: scale === maxScale,
  });

  const actionsNode = (
    <div className={clsx(`${prefixCls}-actions`, classNames.actions)} style={styles.actions}>
      {flipYNode}
      {flipXNode}
      {rotateLeftNode}
      {rotateRightNode}
      {zoomOutNode}
      {zoomInNode}
    </div>
  );

  // >>>>> Render
  return (
    <div className={clsx(`${prefixCls}-footer`, classNames.footer)} style={styles.footer}>
      {progressNode}
      {actionsRender
        ? actionsRender(actionsNode, {
            icons: {
              prevIcon: switchPrevNode,
              nextIcon: switchNextNode,
              flipYIcon: flipYNode,
              flipXIcon: flipXNode,
              rotateLeftIcon: rotateLeftNode,
              rotateRightIcon: rotateRightNode,
              zoomOutIcon: zoomOutNode,
              zoomInIcon: zoomInNode,
            },
            actions: {
              onActive,
              onFlipY,
              onFlipX,
              onRotateLeft,
              onRotateRight,
              onZoomOut,
              onZoomIn,
              onReset,
              onClose,
            },
            transform,
            current,
            total: count,
            image,
          })
        : actionsNode}
    </div>
  );
}
