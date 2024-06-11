import classnames from 'classnames';
import type { DialogProps as IDialogPropTypes } from 'rc-dialog';
import Dialog from 'rc-dialog';
import addEventListener from 'rc-util/lib/Dom/addEventListener';
import KeyCode from 'rc-util/lib/KeyCode';
import React, { useContext, useEffect, useRef, useState } from 'react';
import type { ImgInfo } from './Image';
import Operations from './Operations';
import { PreviewGroupContext } from './context';
import type { TransformAction, TransformType } from './hooks/useImageTransform';
import useImageTransform from './hooks/useImageTransform';
import useMouseEvent from './hooks/useMouseEvent';
import useStatus from './hooks/useStatus';
import useTouchEvent from './hooks/useTouchEvent';
import { BASE_SCALE_RATIO } from './previewConfig';

export type ToolbarRenderInfoType = {
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
  actions: {
    onActive?: (offset: number) => void;
    onFlipY: () => void;
    onFlipX: () => void;
    onRotateLeft: () => void;
    onRotateRight: () => void;
    onZoomOut: () => void;
    onZoomIn: () => void;
    onClose: () => void;
    onReset: () => void;
  };
  transform: TransformType;
  current: number;
  total: number;
  image: ImgInfo;
};

export interface PreviewProps extends Omit<IDialogPropTypes, 'onClose'> {
  imgCommonProps?: React.ImgHTMLAttributes<HTMLImageElement>;
  src?: string;
  alt?: string;
  imageInfo?: {
    width: number | string;
    height: number | string;
  };
  fallback?: string;
  movable?: boolean;
  rootClassName?: string;
  icons?: {
    rotateLeft?: React.ReactNode;
    rotateRight?: React.ReactNode;
    zoomIn?: React.ReactNode;
    zoomOut?: React.ReactNode;
    close?: React.ReactNode;
    left?: React.ReactNode;
    right?: React.ReactNode;
    flipX?: React.ReactNode;
    flipY?: React.ReactNode;
  };
  current?: number;
  count?: number;
  closeIcon?: React.ReactNode;
  countRender?: (current: number, total: number) => React.ReactNode;
  scaleStep?: number;
  minScale?: number;
  maxScale?: number;
  imageRender?: (
    originalNode: React.ReactElement,
    info: { transform: TransformType; current?: number; image?: ImgInfo },
  ) => React.ReactNode;
  onClose?: () => void;
  onTransform?: (info: { transform: TransformType; action: TransformAction }) => void;
  toolbarRender?: (
    originalNode: React.ReactElement,
    info: ToolbarRenderInfoType,
  ) => React.ReactNode;
  onChange?: (current, prev) => void;
}

interface PreviewImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string;
  imgRef: React.MutableRefObject<HTMLImageElement>;
}

const PreviewImage: React.FC<PreviewImageProps> = ({ fallback, src, imgRef, ...props }) => {
  const [getImgRef, srcAndOnload] = useStatus({
    src,
    fallback,
  });

  return (
    <img
      ref={ref => {
        imgRef.current = ref;
        getImgRef(ref);
      }}
      {...props}
      {...srcAndOnload}
    />
  );
};

const Preview: React.FC<PreviewProps> = props => {
  const {
    prefixCls,
    src,
    alt,
    imageInfo,
    fallback,
    movable = true,
    onClose,
    visible,
    icons = {},
    rootClassName,
    closeIcon,
    getContainer,
    current = 0,
    count = 1,
    countRender,
    scaleStep = 0.5,
    minScale = 1,
    maxScale = 50,
    transitionName = 'zoom',
    maskTransitionName = 'fade',
    imageRender,
    imgCommonProps,
    toolbarRender,
    onTransform,
    onChange,
    ...restProps
  } = props;

  const imgRef = useRef<HTMLImageElement>();
  const groupContext = useContext(PreviewGroupContext);
  const showLeftOrRightSwitches = groupContext && count > 1;
  const showOperationsProgress = groupContext && count >= 1;
  const [enableTransition, setEnableTransition] = useState(true);
  const { transform, resetTransform, updateTransform, dispatchZoomChange } = useImageTransform(
    imgRef,
    minScale,
    maxScale,
    onTransform,
  );
  const { isMoving, onMouseDown, onWheel } = useMouseEvent(
    imgRef,
    movable,
    visible,
    scaleStep,
    transform,
    updateTransform,
    dispatchZoomChange,
  );
  const { isTouching, onTouchStart, onTouchMove, onTouchEnd } = useTouchEvent(
    imgRef,
    movable,
    visible,
    minScale,
    transform,
    updateTransform,
    dispatchZoomChange,
  );
  const { rotate, scale } = transform;

  const wrapClassName = classnames({
    [`${prefixCls}-moving`]: isMoving,
  });

  useEffect(() => {
    if (!enableTransition) {
      setEnableTransition(true);
    }
  }, [enableTransition]);

  const onAfterClose = () => {
    resetTransform('close');
  };

  const onZoomIn = () => {
    dispatchZoomChange(BASE_SCALE_RATIO + scaleStep, 'zoomIn');
  };

  const onZoomOut = () => {
    dispatchZoomChange(BASE_SCALE_RATIO / (BASE_SCALE_RATIO + scaleStep), 'zoomOut');
  };

  const onRotateRight = () => {
    updateTransform({ rotate: rotate + 90 }, 'rotateRight');
  };

  const onRotateLeft = () => {
    updateTransform({ rotate: rotate - 90 }, 'rotateLeft');
  };

  const onFlipX = () => {
    updateTransform({ flipX: !transform.flipX }, 'flipX');
  };

  const onFlipY = () => {
    updateTransform({ flipY: !transform.flipY }, 'flipY');
  };

  const onReset = () => {
    resetTransform('reset');
  };

  const onActive = (offset: number) => {
    const position = current + offset;

    if (!Number.isInteger(position) || position < 0 || position > count - 1) {
      return;
    }

    setEnableTransition(false);
    resetTransform(offset < 0 ? 'prev' : 'next');
    onChange?.(position, current);
  }

  const onKeyDown = (event: KeyboardEvent) => {
    if (!visible || !showLeftOrRightSwitches) return;

    if (event.keyCode === KeyCode.LEFT) {
      onActive(-1);
    } else if (event.keyCode === KeyCode.RIGHT) {
      onActive(1);
    }
  };

  const onDoubleClick = (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    if (visible) {
      if (scale !== 1) {
        updateTransform({ x: 0, y: 0, scale: 1 }, 'doubleClick');
      } else {
        dispatchZoomChange(
          BASE_SCALE_RATIO + scaleStep,
          'doubleClick',
          event.clientX,
          event.clientY,
        );
      }
    }
  };

  useEffect(() => {
    const onKeyDownListener = addEventListener(window, 'keydown', onKeyDown, false);

    return () => {
      onKeyDownListener.remove();
    };
  }, [visible, showLeftOrRightSwitches, current]);

  const imgNode = (
    <PreviewImage
      {...imgCommonProps}
      width={props.width}
      height={props.height}
      imgRef={imgRef}
      className={`${prefixCls}-img`}
      alt={alt}
      style={{
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale3d(${transform.flipX ? '-' : ''
          }${scale}, ${transform.flipY ? '-' : ''}${scale}, 1) rotate(${rotate}deg)`,
        transitionDuration: (!enableTransition || isTouching) && '0s',
      }}
      fallback={fallback}
      src={src}
      onWheel={onWheel}
      onMouseDown={onMouseDown}
      onDoubleClick={onDoubleClick}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchEnd}
    />
  );

  const image = {
    url: src,
    alt,
    ...imageInfo,
  };

  return (
    <>
      <Dialog
        transitionName={transitionName}
        maskTransitionName={maskTransitionName}
        closable={false}
        keyboard
        prefixCls={prefixCls}
        onClose={onClose}
        visible={visible}
        classNames={{
          wrapper: wrapClassName,
        }}
        rootClassName={rootClassName}
        getContainer={getContainer}
        {...restProps}
        afterClose={onAfterClose}
      >
        <div className={`${prefixCls}-img-wrapper`}>
          {imageRender
            ? imageRender(imgNode, { transform, image, ...(groupContext ? { current } : {}) })
            : imgNode}
        </div>
      </Dialog>
      <Operations
        visible={visible}
        transform={transform}
        maskTransitionName={maskTransitionName}
        closeIcon={closeIcon}
        getContainer={getContainer}
        prefixCls={prefixCls}
        rootClassName={rootClassName}
        icons={icons}
        countRender={countRender}
        showSwitch={showLeftOrRightSwitches}
        showProgress={showOperationsProgress}
        current={current}
        count={count}
        scale={scale}
        minScale={minScale}
        maxScale={maxScale}
        toolbarRender={toolbarRender}
        onActive={onActive}
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        onRotateRight={onRotateRight}
        onRotateLeft={onRotateLeft}
        onFlipX={onFlipX}
        onFlipY={onFlipY}
        onClose={onClose}
        onReset={onReset}
        zIndex={restProps.zIndex !== undefined ? restProps.zIndex + 1 : undefined}
        image={image}
      />
    </>
  );
};

export default Preview;
