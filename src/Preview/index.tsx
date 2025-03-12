import CSSMotion from '@rc-component/motion';
import Portal, { type PortalProps } from '@rc-component/portal';
import { useEvent } from '@rc-component/util';
import KeyCode from '@rc-component/util/lib/KeyCode';
import classnames from 'classnames';
import React, { useContext, useEffect, useRef, useState } from 'react';
import type { ImgInfo, SemanticName } from '../Image';
import { PreviewGroupContext } from '../context';
import type { TransformAction, TransformType } from '../hooks/useImageTransform';
import useImageTransform from '../hooks/useImageTransform';
import useMouseEvent from '../hooks/useMouseEvent';
import useStatus from '../hooks/useStatus';
import useTouchEvent from '../hooks/useTouchEvent';
import { BASE_SCALE_RATIO } from '../previewConfig';
import CloseBtn from './CloseBtn';
import Footer from './Footer';
import PrevNext from './PrevNext';

export interface OperationIcons {
  rotateLeft?: React.ReactNode;
  rotateRight?: React.ReactNode;
  zoomIn?: React.ReactNode;
  zoomOut?: React.ReactNode;
  close?: React.ReactNode;
  prev?: React.ReactNode;
  next?: React.ReactNode;
  /** @deprecated Please use `prev` instead */
  left?: React.ReactNode;
  /** @deprecated Please use `next` instead */
  right?: React.ReactNode;
  flipX?: React.ReactNode;
  flipY?: React.ReactNode;
}

export interface Actions {
  onActive: (offset: number) => void;
  onFlipY: () => void;
  onFlipX: () => void;
  onRotateLeft: () => void;
  onRotateRight: () => void;
  onZoomOut: () => void;
  onZoomIn: () => void;
  onClose: () => void;
  onReset: () => void;
}

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
  actions: Actions;
  transform: TransformType;
  current: number;
  total: number;
  image: ImgInfo;
};

export interface PreviewProps {
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
  icons?: OperationIcons;
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
  actionsRender?: (
    originalNode: React.ReactElement,
    info: ToolbarRenderInfoType,
  ) => React.ReactNode;
  onChange?: (current: number, prev: number) => void;
  classNames?: Partial<Record<SemanticName, string>>;
  styles?: Partial<Record<SemanticName, React.CSSProperties>> & {
    /** Temporarily used in PurePanel, not used externally by antd */
    wrapper?: React.CSSProperties;
  };

  // Misc
  prefixCls: string;

  // Portal
  visible: boolean;
  getContainer?: PortalProps['getContainer'];

  // Motion
  motionName: string;

  // Image
  width?: string | number;
  height?: string | number;
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
    motionName = 'fade',
    imageRender,
    imgCommonProps,
    actionsRender,
    onTransform,
    onChange,
    classNames: classNames,
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

  // ======================== Transform =========================
  // >>>>> Actions
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

  // >>>>> Effect: Keyboard
  const onKeyDown = useEvent((event: KeyboardEvent) => {
    if (visible) {
      const { keyCode } = event;

      if (keyCode === KeyCode.ESC) {
        onClose?.();
      }

      if (showLeftOrRightSwitches) {
        if (keyCode === KeyCode.LEFT) {
          onActive(-1);
        } else if (keyCode === KeyCode.RIGHT) {
          onActive(1);
        }
      }
    }
  });

  useEffect(() => {
    if (visible) {
      window.addEventListener('keydown', onKeyDown);

      return () => {
        window.removeEventListener('keydown', onKeyDown);
      };
    }
  }, [visible]);

  // ========================== Render ==========================
  return (
    <>
      {visible && (
        <Portal open getContainer={getContainer ?? document.body}>
          <CSSMotion motionName={motionName} visible={visible} motionAppear motionEnter motionLeave>
            {({ className: motionClassName, style: motionStyle }) => {
              return (
                <div
                  className={classnames(
                    prefixCls,
                    rootClassName,
                    classNames?.root,
                    motionClassName,
                  )}
                  style={{
                    ...motionStyle,
                  }}
                >
                  {/* Mask */}
                  <div
                    className={classnames(`${prefixCls}-mask`, classNames?.mask)}
                    style={styles?.mask}
                    onClick={onClose}
                  />

                  {/* Body */}
                  <div className={`${prefixCls}-body`}>
                    {/* Preview Image */}
                    {imageRender
                      ? imageRender(imgNode, {
                          transform,
                          image,
                          ...(groupContext ? { current } : {}),
                        })
                      : imgNode}
                  </div>

                  {/* Close Button */}
                  <CloseBtn
                    prefixCls={prefixCls}
                    icon={closeIcon === false ? closeIcon : closeIcon || icons.close}
                    onClick={onClose}
                  />

                  {/* Switch prev or next */}
                  {showLeftOrRightSwitches && (
                    <PrevNext
                      prefixCls={prefixCls}
                      current={current}
                      count={count}
                      icons={icons}
                      onActive={onActive}
                    />
                  )}

                  {/* Footer */}
                  <Footer
                    prefixCls={prefixCls}
                    showProgress={showOperationsProgress}
                    current={current}
                    count={count}
                    showSwitch={showLeftOrRightSwitches}
                    // Render
                    image={image}
                    transform={transform}
                    icons={icons}
                    countRender={countRender}
                    actionsRender={actionsRender}
                    // Scale
                    scale={scale}
                    minScale={minScale}
                    maxScale={maxScale}
                    // Actions
                    onActive={onActive}
                    onFlipY={onFlipY}
                    onFlipX={onFlipX}
                    onRotateLeft={onRotateLeft}
                    onRotateRight={onRotateRight}
                    onZoomOut={onZoomOut}
                    onZoomIn={onZoomIn}
                    onClose={onClose}
                    onReset={onReset}
                  />
                </div>
              );
            }}
          </CSSMotion>
        </Portal>
      )}
    </>
  );
};

export default Preview;
