import * as React from 'react';
import cn from 'classnames';
import { getOffset } from 'rc-util/lib/Dom/css';
import Preview from './Preview';

const { useState } = React;

export interface ImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'placeholder'> {
  // Original
  src?: string;

  prefixCls?: string;
  placeholder?: React.ReactNode;
  fallback?: string;
  preview?: boolean;
  onPreviewClose?: (e: React.SyntheticEvent<HTMLDivElement | HTMLLIElement>) => void;
}

const ImageInternal: React.FC<ImageProps> = ({
  src,
  alt,
  onPreviewClose: onInitialPreviewClose,
  prefixCls = 'rc-image',
  placeholder,
  fallback,
  width,
  height,
  style,
  preview = true,

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
  const [isShowPreview, setShowPreview] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isShowPlaceholder, setIsShowPlaceholder] = useState(placeholder !== undefined);
  const [mousePosition, setMousePosition] = useState<null | { x: number; y: number }>(null);

  const onLoad = () => {
    if (!isError) {
      setIsShowPlaceholder(false);
    }
  };

  const onError = () => {
    setIsError(true);
    setIsShowPlaceholder(false);
  };

  const onPreview: React.MouseEventHandler<HTMLImageElement> = e => {
    const { left, top } = getOffset(e.target);

    setShowPreview(true);
    setMousePosition({
      x: left,
      y: top,
    });
  };

  const onPreviewClose = (e: React.SyntheticEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setShowPreview(false);
    setMousePosition(null);

    if (onInitialPreviewClose) onInitialPreviewClose(e);
  };

  React.useEffect(() => {
    if (placeholder) {
      setIsShowPlaceholder(true);
    }
  }, [src]);

  const className = cn(prefixCls, {
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
    className: `${prefixCls}-img`,
  };

  return (
    <div
      {...otherProps}
      className={className}
      onClick={preview ? onPreview : null}
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

      {isShowPlaceholder && <div className={`${prefixCls}-placeholder`}>{placeholder}</div>}
      {preview && (
        <Preview
          visible={isShowPreview}
          prefixCls={`${prefixCls}-preview`}
          onClose={onPreviewClose}
          mousePosition={mousePosition}
          src={mergedSrc}
          alt={alt}
        />
      )}
    </div>
  );
};

ImageInternal.displayName = 'Image';

export default ImageInternal;
