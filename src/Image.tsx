import cn from 'classnames';
import type { IDialogPropTypes } from 'rc-dialog/lib/IDialogPropTypes';
import { getOffset } from 'rc-util/lib/Dom/css';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import type { GetContainer } from 'rc-util/lib/PortalWrapper';
import * as React from 'react';
import { useContext, useEffect, useRef, useState } from 'react';
import type { TransformType } from './hooks/useImageTransform';
import type { PreviewProps, ToolbarRenderType } from './Preview';
import Preview from './Preview';
import PreviewGroup, { context } from './PreviewGroup';

export interface ImagePreviewType
  extends Omit<
    IDialogPropTypes,
    'mask' | 'visible' | 'closable' | 'prefixCls' | 'onClose' | 'afterClose' | 'wrapClassName'
  > {
  src?: string;
  visible?: boolean;
  minScale?: number;
  maxScale?: number;
  onVisibleChange?: (value: boolean, prevValue: boolean) => void;
  getContainer?: GetContainer | false;
  mask?: React.ReactNode;
  maskClassName?: string;
  icons?: PreviewProps['icons'];
  scaleStep?: number;
  imageRender?: (params: {
    originalNode: React.ReactNode;
    transform: TransformType;
  }) => React.ReactNode;
  onTransform?: PreviewProps['onTransform'];
  toolbarRender?: (params: Omit<ToolbarRenderType, 'current' | 'total'>) => React.ReactNode;
}

let uuid = 0;

export interface ImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'placeholder' | 'onClick'> {
  // Original
  src?: string;
  wrapperClassName?: string;
  wrapperStyle?: React.CSSProperties;
  prefixCls?: string;
  previewPrefixCls?: string;
  placeholder?: React.ReactNode;
  fallback?: string;
  rootClassName?: string;
  preview?: boolean | ImagePreviewType;
  /**
   * @deprecated since version 3.2.1
   */
  onPreviewClose?: (value: boolean, prevValue: boolean) => void;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

interface CompoundedComponent<P> extends React.FC<P> {
  PreviewGroup: typeof PreviewGroup;
}

type ImageStatus = 'normal' | 'error' | 'loading';

function isImageValid(src) {
  return new Promise(resolve => {
    const img = document.createElement('img');
    img.onerror = () => resolve(false);
    img.onload = () => resolve(true);
    img.src = src;
  });
}

const ImageInternal: CompoundedComponent<ImageProps> = ({
  src: imgSrc,
  alt,
  onPreviewClose: onInitialPreviewClose,
  prefixCls = 'rc-image',
  previewPrefixCls = `${prefixCls}-preview`,
  placeholder,
  fallback,
  width,
  height,
  style,
  preview = true,
  className,
  onClick,
  onError,
  wrapperClassName,
  wrapperStyle,
  rootClassName,

  // Img
  crossOrigin,
  decoding,
  loading,
  referrerPolicy,
  sizes,
  srcSet,
  useMap,
  draggable,
  ...otherProps
}) => {
  const isCustomPlaceholder = placeholder && placeholder !== true;
  const {
    src: previewSrc,
    visible: previewVisible = undefined,
    onVisibleChange: onPreviewVisibleChange = onInitialPreviewClose,
    getContainer: getPreviewContainer = undefined,
    mask: previewMask,
    maskClassName,
    icons,
    scaleStep,
    minScale,
    maxScale,
    imageRender,
    toolbarRender,
    ...dialogProps
  }: ImagePreviewType = typeof preview === 'object' ? preview : {};
  const src = previewSrc ?? imgSrc;
  const [isShowPreview, setShowPreview] = useMergedState(!!previewVisible, {
    value: previewVisible,
    onChange: onPreviewVisibleChange,
  });
  const [status, setStatus] = useState<ImageStatus>(isCustomPlaceholder ? 'loading' : 'normal');
  const [mousePosition, setMousePosition] = useState<null | { x: number; y: number }>(null);
  const isError = status === 'error';
  const {
    isPreviewGroup,
    setShowPreview: setGroupShowPreview,
    setMousePosition: setGroupMousePosition,
    registerImage,
    setCurrentIndex,
    getStartPreviewIndex,
  } = useContext(context);
  const [currentId] = useState<number>(() => {
    uuid += 1;
    return uuid;
  });
  const canPreview = !!preview;

  const isLoaded = useRef(false);

  const imgCommonProps = {
    crossOrigin,
    decoding,
    draggable,
    loading,
    referrerPolicy,
    sizes,
    srcSet,
    useMap,
    alt,
  };

  const onLoad = () => {
    setStatus('normal');
  };

  const onPreview: React.MouseEventHandler<HTMLDivElement> = e => {
    const { left, top } = getOffset(e.target);
    if (isPreviewGroup) {
      setGroupMousePosition({
        x: left,
        y: top,
      });

      setCurrentIndex(getStartPreviewIndex(currentId));
      setGroupShowPreview(true);
    } else {
      setMousePosition({
        x: left,
        y: top,
      });
      setShowPreview(true);
    }

    onClick?.(e);
  };

  const onPreviewClose = () => {
    setShowPreview(false);
    setMousePosition(null);
  };

  const getImgRef = (img?: HTMLImageElement) => {
    isLoaded.current = false;
    if (status !== 'loading') return;
    if (img?.complete && (img.naturalWidth || img.naturalHeight)) {
      isLoaded.current = true;
      onLoad();
    }
  };

  useEffect(() => {
    isImageValid(src).then(isValid => {
      if (!isValid) {
        setStatus('error');
      }
    });
  }, [src]);

  // Keep order start
  // Resolve https://github.com/ant-design/ant-design/issues/28881
  // Only need unRegister when component unMount
  useEffect(() => {
    const unRegister = registerImage(currentId, {
      src,
      imgCommonProps,
      canPreview,
    });

    return unRegister;
  }, []);

  useEffect(() => {
    registerImage(currentId, { src, imgCommonProps, canPreview });
  }, [src, canPreview, JSON.stringify(imgCommonProps)]);
  // Keep order end

  useEffect(() => {
    if (isError) {
      setStatus('normal');
    }
    if (isCustomPlaceholder && !isLoaded.current) {
      setStatus('loading');
    }
  }, [imgSrc]);

  const wrapperClass = cn(prefixCls, wrapperClassName, rootClassName, {
    [`${prefixCls}-error`]: isError,
  });

  const mergedSrc = isError && fallback ? fallback : src;

  return (
    <>
      <div
        {...otherProps}
        className={wrapperClass}
        onClick={canPreview ? onPreview : onClick}
        style={{
          width,
          height,
          ...wrapperStyle,
        }}
      >
        <img
          {...imgCommonProps}
          className={cn(
            `${prefixCls}-img`,
            {
              [`${prefixCls}-img-placeholder`]: placeholder === true,
            },
            className,
          )}
          style={{
            height,
            ...style,
          }}
          ref={getImgRef}
          {...(isError && fallback ? { src: fallback } : { onLoad, src: imgSrc })}
          width={width}
          height={height}
          onError={onError}
        />

        {status === 'loading' && (
          <div aria-hidden="true" className={`${prefixCls}-placeholder`}>
            {placeholder}
          </div>
        )}

        {/* Preview Click Mask */}
        {previewMask && canPreview && (
          <div
            className={cn(`${prefixCls}-mask`, maskClassName)}
            style={{
              display: style?.display === 'none' ? 'none' : undefined,
            }}
          >
            {previewMask}
          </div>
        )}
      </div>
      {!isPreviewGroup && canPreview && (
        <Preview
          aria-hidden={!isShowPreview}
          visible={isShowPreview}
          prefixCls={previewPrefixCls}
          onClose={onPreviewClose}
          mousePosition={mousePosition}
          src={mergedSrc}
          alt={alt}
          getContainer={getPreviewContainer}
          icons={icons}
          scaleStep={scaleStep}
          minScale={minScale}
          maxScale={maxScale}
          rootClassName={rootClassName}
          imageRender={imageRender}
          imgCommonProps={imgCommonProps}
          toolbarRender={toolbarRender}
          {...dialogProps}
        />
      )}
    </>
  );
};

ImageInternal.PreviewGroup = PreviewGroup;

ImageInternal.displayName = 'Image';

export default ImageInternal;
