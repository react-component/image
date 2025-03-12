import type { DialogProps as IDialogPropTypes } from '@rc-component/dialog';
import Portal from '@rc-component/portal';
import KeyCode from '@rc-component/util/lib/KeyCode';
import classnames from 'classnames';
import React, { useContext, useEffect, useRef, useState } from 'react';
import type { ImgInfo, SemanticName } from './Image';
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

export interface PreviewProps extends Omit<IDialogPropTypes, 'onClose' | 'styles' | 'classNames'> {
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
  classNames?: Partial<Record<SemanticName, string>>;
  styles?: Partial<Record<SemanticName, React.CSSProperties>> & {
    /** Temporarily used in PurePanel, not used externally by antd */
    wrapper?: React.CSSProperties;
  };
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
    maskTransitionName = 'fade',
    imageRender,
    imgCommonProps,
    toolbarRender,
    onTransform,
    onChange,
    classNames: imageClassNames,
    styles,
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

  useEffect(() => {
    if (!visible) {
      resetTransform('close');
    }
  }, [visible]);

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
  };

  useEffect(() => {
    const onGlobalKeyDown = (event: KeyboardEvent) => {
      if (!visible) return;

      if (event.keyCode === KeyCode.ESC) {
        onClose?.();
      }

      if (showLeftOrRightSwitches) {
        if (event.keyCode === KeyCode.LEFT) {
          onActive(-1);
        } else if (event.keyCode === KeyCode.RIGHT) {
          onActive(1);
        }
      }
    };

    window.addEventListener('keydown', onGlobalKeyDown, false);

    return () => {
      window.removeEventListener('keydown', onGlobalKeyDown);
    };
  }, [visible, showLeftOrRightSwitches, current]);

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

  const imgNode = (
    <PreviewImage
      {...imgCommonProps}
      width={props.width}
      height={props.height}
      imgRef={imgRef}
      className={`${prefixCls}-img`}
      alt={alt}
      style={{
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale3d(${
          transform.flipX ? '-' : ''
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
      {visible && (
        <Portal open getContainer={getContainer ?? document.body}>
          <div
            className={classnames(prefixCls, rootClassName, imageClassNames?.root)}
            style={{
              ...styles?.root,
              zIndex: restProps.zIndex,
            }}
          >
            <div 
              className={classnames(`${prefixCls}-mask`, imageClassNames?.mask)} 
              style={styles?.mask}
              onClick={onClose}
            />
            <div 
              className={classnames(`${prefixCls}-wrap`, wrapClassName)}
              style={styles?.wrapper}
            >
              <div className={`${prefixCls}-body`}>
                <div className={`${prefixCls}-img-wrapper`}>
                  {imageRender
                    ? imageRender(imgNode, { transform, image, ...(groupContext ? { current } : {}) })
                    : imgNode}
                </div>
              </div>
            </div>
          </div>
        </Portal>
      )}
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
        classNames={imageClassNames}
        styles={styles}
      />
    </>
  );
};

export default Preview;
