import * as React from 'react';
import { useState } from 'react';
import cn from 'classnames';
import { getOffset } from 'rc-util/lib/Dom/css';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import { GetContainer } from 'rc-util/lib/PortalWrapper';
import Preview from './Preview';

export interface ImagePreviewType {
  visible?: boolean;
  onVisibleChange?: (value: boolean, prevValue: boolean) => void;
  getContainer?: GetContainer | false;
}

export interface ImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'placeholder' | 'onClick'> {
  // Original
  src?: string;

  prefixCls?: string;
  previewPrefixCls?: string;
  placeholder?: React.ReactNode;
  fallback?: string;
  preview?: boolean | ImagePreviewType;
  /**
   * @deprecated since version 3.2.1
   */
  onPreviewClose?: (value: boolean, prevValue: boolean) => void;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

type ImageStatus = 'normal' | 'error' | 'loading';

const ImageInternal: React.FC<ImageProps> = ({
  src,
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
  className: originalClassName,
  onClick,

  // Img
  crossOrigin,
  decoding,
  loading,
  referrerPolicy,
  sizes,
  srcSet,
  useMap,
  ...otherProps
}) => {
  const isCustomPlaceholder = placeholder && placeholder !== true;
  const { visible = undefined, onVisibleChange = onInitialPreviewClose, getContainer = undefined } =
    typeof preview === 'object' ? preview : {};
  const isControlled = visible !== undefined;
  const [isShowPreview, setShowPreview] = useMergedState(!!visible, {
    value: visible,
    onChange: onVisibleChange,
  });
  const [status, setStatus] = useState<ImageStatus>(isCustomPlaceholder ? 'loading' : 'normal');
  const [mousePosition, setMousePosition] = useState<null | { x: number; y: number }>(null);
  const isError = status === 'error';

  const onLoad = () => {
    setStatus('normal');
  };

  const onError = () => {
    setStatus('error');
  };

  const onPreview: React.MouseEventHandler<HTMLDivElement> = e => {
    if (!isControlled) {
      const { left, top } = getOffset(e.target);

      setMousePosition({
        x: left,
        y: top,
      });
    }
    setShowPreview(true);

    if (onClick) onClick(e);
  };

  const onPreviewClose = (e: React.SyntheticEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setShowPreview(false);
    if (!isControlled) {
      setMousePosition(null);
    }
  };

  React.useEffect(() => {
    if (isCustomPlaceholder) {
      setStatus('loading');
    }
  }, [src]);

  const className = cn(prefixCls, originalClassName, {
    [`${prefixCls}-error`]: isError,
  });

  const mergedSrc = isError && fallback ? fallback : src;
  const imgCommonProps = {
    crossOrigin,
    decoding,
    loading,
    referrerPolicy,
    sizes,
    srcSet,
    useMap,
    alt,
    className: cn(`${prefixCls}-img`, {
      [`${prefixCls}-img-placeholder`]: placeholder === true,
    }),
    style: height !== undefined ? { height } : undefined,
  };

  return (
    <>
      <div
        {...otherProps}
        className={className}
        onClick={preview && !isError ? onPreview : onClick}
        style={{
          ...style,
          width,
          height,
        }}
      >
        {isError && fallback ? (
          <img {...imgCommonProps} src={fallback} />
        ) : (
          <img {...imgCommonProps} onLoad={onLoad} onError={onError} src={src} />
        )}

        {status === 'loading' && (
          <div aria-hidden="true" className={`${prefixCls}-placeholder`}>
            {placeholder}
          </div>
        )}
      </div>
      {preview && !isError && (
        <Preview
          aria-hidden={!isShowPreview}
          visible={isShowPreview}
          prefixCls={previewPrefixCls}
          onClose={onPreviewClose}
          mousePosition={mousePosition}
          src={mergedSrc}
          alt={alt}
          getContainer={getContainer}
        />
      )}
    </>
  );
};

ImageInternal.displayName = 'Image';

export default ImageInternal;
