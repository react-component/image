import cn from 'classnames';
import type { IDialogPropTypes } from 'rc-dialog/lib/IDialogPropTypes';
import { getOffset } from 'rc-util/lib/Dom/css';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import type { GetContainer } from 'rc-util/lib/PortalWrapper';
import * as React from 'react';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { COMMON_PROPS } from './common';
import { PreviewGroupContext } from './context';
import type { TransformType } from './hooks/useImageTransform';
import useRegisterImage from './hooks/useRegisterImage';
import type { ImageElementProps } from './interface';
import type { PreviewProps, ToolbarRenderInfoType } from './Preview';
import Preview from './Preview';
import PreviewGroup from './PreviewGroup';
import { isImageValid } from './util';

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
  imageRender?: (
    originalNode: React.ReactNode,
    info: { transform: TransformType },
  ) => React.ReactNode;
  onTransform?: PreviewProps['onTransform'];
  toolbarRender?: (
    originalNode: React.ReactNode,
    info: Omit<ToolbarRenderInfoType, 'current' | 'total'>,
  ) => React.ReactNode;
}

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

const ImageInternal: CompoundedComponent<ImageProps> = props => {
  const {
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

    ...otherProps
  } = props;

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

  const groupContext = useContext(PreviewGroupContext);

  const canPreview = !!preview;

  const isLoaded = useRef(false);

  const onLoad = () => {
    setStatus('normal');
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

  // https://github.com/react-component/image/pull/187
  useEffect(() => {
    isImageValid(imgSrc).then(isValid => {
      if (!isValid) {
        setStatus('error');
      }
    });
  }, [imgSrc]);

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

  // ========================= ImageProps =========================
  const imgCommonProps = useMemo(
    () => {
      const obj: ImageElementProps = {};
      COMMON_PROPS.forEach((prop: any) => {
        if (props[prop] !== undefined) {
          obj[prop] = props[prop];
        }
      });

      return obj;
    },
    COMMON_PROPS.map(prop => props[prop]),
  );

  // ========================== Register ==========================
  const registerData: ImageElementProps = useMemo(
    () => ({
      ...imgCommonProps,
      src,
    }),
    [src, imgCommonProps],
  );

  const imageId = useRegisterImage(canPreview, registerData);

  // ========================== Preview ===========================
  const onPreview: React.MouseEventHandler<HTMLDivElement> = e => {
    const { left, top } = getOffset(e.target);
    if (groupContext) {
      groupContext.onPreview(imageId, left, top);
    } else {
      setMousePosition({
        x: left,
        y: top,
      });
      setShowPreview(true);
    }

    onClick?.(e);
  };

  // =========================== Render ===========================
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
      {!groupContext && canPreview && (
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
