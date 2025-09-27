import CSSMotion from '@rc-component/motion';
import Portal, { type PortalProps } from '@rc-component/portal';
import { useEvent } from '@rc-component/util';
import useLayoutEffect from '@rc-component/util/lib/hooks/useLayoutEffect';
import KeyCode from '@rc-component/util/lib/KeyCode';
import { clsx } from 'clsx';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { PreviewGroupContext } from '../context';
import type { TransformAction, TransformType } from '../hooks/useImageTransform';
import useImageTransform from '../hooks/useImageTransform';
import useMouseEvent from '../hooks/useMouseEvent';
import useStatus from '../hooks/useStatus';
import useTouchEvent from '../hooks/useTouchEvent';
import type { ImgInfo } from '../Image';
import { BASE_SCALE_RATIO } from '../previewConfig';
import CloseBtn from './CloseBtn';
import Footer, { type FooterSemanticName } from './Footer';
import PrevNext from './PrevNext';

// Note: if you want to add `action`,
// pls contact @zombieJ or @thinkasany first.
export type PreviewSemanticName = 'root' | 'mask' | 'body' | FooterSemanticName;

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

export interface InternalPreviewConfig {
  // Semantic
  /** Better to use `classNames.root` instead */
  rootClassName?: string;

  // Image
  src?: string;
  alt?: string;

  // Scale
  scaleStep?: number;
  minScale?: number;
  maxScale?: number;

  // Display
  motionName?: string;
  open?: boolean;
  getContainer?: PortalProps['getContainer'];
  zIndex?: number;
  afterOpenChange?: (open: boolean) => void;

  // Operation
  movable?: boolean;
  icons?: OperationIcons;
  closeIcon?: React.ReactNode;

  onTransform?: (info: { transform: TransformType; action: TransformAction }) => void;

  // Render
  countRender?: (current: number, total: number) => React.ReactNode;
  imageRender?: (
    originalNode: React.ReactElement,
    info: { transform: TransformType; current?: number; image: ImgInfo },
  ) => React.ReactNode;
  actionsRender?: (
    originalNode: React.ReactElement,
    info: ToolbarRenderInfoType,
  ) => React.ReactNode;
}

export interface PreviewProps extends InternalPreviewConfig {
  // Misc
  prefixCls: string;

  classNames?: Partial<Record<PreviewSemanticName, string>>;
  styles?: Partial<Record<PreviewSemanticName, React.CSSProperties>>;

  // Origin image Info
  imageInfo?: {
    width: number | string;
    height: number | string;
  };
  fallback?: string;

  // Preview image
  imgCommonProps?: React.ImgHTMLAttributes<HTMLImageElement>;
  width?: string | number;
  height?: string | number;

  // Pagination
  current?: number;
  count?: number;
  onChange?: (current: number, prev: number) => void;

  // Events
  onClose?: () => void;

  // Display
  mousePosition: null | { x: number; y: number };
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
    rootClassName,
    src,
    alt,
    imageInfo,
    fallback,
    movable = true,
    onClose,
    open,
    afterOpenChange,
    icons = {},
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
    classNames = {},
    styles = {},
    mousePosition,
    zIndex,
  } = props;

  const imgRef = useRef<HTMLImageElement>();
  const groupContext = useContext(PreviewGroupContext);
  const showLeftOrRightSwitches = groupContext && count > 1;
  const showOperationsProgress = groupContext && count >= 1;

  // ======================== Transform =========================
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
    open,
    scaleStep,
    transform,
    updateTransform,
    dispatchZoomChange,
  );
  const { isTouching, onTouchStart, onTouchMove, onTouchEnd } = useTouchEvent(
    imgRef,
    movable,
    open,
    minScale,
    transform,
    updateTransform,
    dispatchZoomChange,
  );
  const { rotate, scale } = transform;

  useEffect(() => {
    if (!enableTransition) {
      setEnableTransition(true);
    }
  }, [enableTransition]);

  useEffect(() => {
    if (!open) {
      resetTransform('close');
    }
  }, [open]);

  // ========================== Image ===========================
  const onDoubleClick = (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    if (open) {
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

  // ======================== Operation =========================
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
    const nextCurrent = current + offset;

    if (nextCurrent >= 0 && nextCurrent <= count - 1) {
      setEnableTransition(false);
      resetTransform(offset < 0 ? 'prev' : 'next');
      onChange?.(nextCurrent, current);
    }
  };

  // >>>>> Effect: Keyboard
  const onKeyDown = useEvent((event: KeyboardEvent) => {
    if (open) {
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
    if (open) {
      window.addEventListener('keydown', onKeyDown);

      return () => {
        window.removeEventListener('keydown', onKeyDown);
      };
    }
  }, [open]);

  // ======================= Lock Scroll ========================
  const [lockScroll, setLockScroll] = useState(false);

  React.useEffect(() => {
    if (open) {
      setLockScroll(true);
    }
  }, [open]);

  const onVisibleChanged = (nextVisible: boolean) => {
    if (!nextVisible) {
      setLockScroll(false);
    }
    afterOpenChange?.(nextVisible);
  };

  // ========================== Portal ==========================
  const [portalRender, setPortalRender] = useState(false);
  useLayoutEffect(() => {
    if (open) {
      setPortalRender(true);
    }
  }, [open]);

  // ========================== Render ==========================
  const bodyStyle: React.CSSProperties = {
    ...styles.body,
  };
  if (mousePosition) {
    bodyStyle.transformOrigin = `${mousePosition.x}px ${mousePosition.y}px`;
  }

  return (
    <Portal open={portalRender} getContainer={getContainer} autoLock={lockScroll}>
      <CSSMotion
        motionName={motionName}
        visible={portalRender && open}
        motionAppear
        motionEnter
        motionLeave
        onVisibleChanged={onVisibleChanged}
      >
        {({ className: motionClassName, style: motionStyle }) => {
          const mergedStyle = {
            ...styles.root,
            ...motionStyle,
          };

          if (zIndex) {
            mergedStyle.zIndex = zIndex;
          }

          return (
            <div
              className={clsx(prefixCls, rootClassName, classNames.root, motionClassName, {
                [`${prefixCls}-moving`]: isMoving,
              })}
              style={mergedStyle}
            >
              {/* Mask */}
              <div
                className={clsx(`${prefixCls}-mask`, classNames.mask)}
                style={styles.mask}
                onClick={onClose}
              />

              {/* Body */}
              <div className={clsx(`${prefixCls}-body`, classNames.body)} style={bodyStyle}>
                {/* Preview Image */}
                {imageRender
                  ? imageRender(imgNode, { transform, image, ...(groupContext ? { current } : {}) })
                  : imgNode}
              </div>

              {/* Close Button */}
              {closeIcon !== false && closeIcon !== null && (
                <CloseBtn
                  prefixCls={prefixCls}
                  icon={closeIcon === true ? icons.close : closeIcon || icons.close}
                  onClick={onClose}
                />
              )}

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
                // Style
                classNames={classNames}
                styles={styles}
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
  );
};

export default Preview;
