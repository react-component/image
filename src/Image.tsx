import * as React from 'react';
import { useState } from 'react';
import cn from 'classnames';
import { getOffset } from 'rc-util/lib/Dom/css';
import Preview, { PreviewProps } from './Preview';
import Group from './group';
import context from './context';

export type Preview =
  | boolean
  | {
      groupKey?: PreviewProps['groupKey'];
    };

export interface ImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'placeholder' | 'onClick'> {
  // Original
  src?: string;

  prefixCls?: string;
  previewPrefixCls?: string;
  placeholder?: React.ReactNode;
  fallback?: string;
  preview?: Preview;
  onPreviewClose?: (e: React.SyntheticEvent<HTMLDivElement | HTMLLIElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

interface CompoundedComponent<P> extends React.FC<P> {
  Group: typeof Group;
}

type ImageStatus = 'normal' | 'error' | 'loading';

const ImageInternal: CompoundedComponent<ImageProps> = ({
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
  const [isShowPreview, setShowPreview] = useState(false);
  const [status, setStatus] = useState<ImageStatus>(isCustomPlaceholder ? 'loading' : 'normal');
  const [mousePosition, setMousePosition] = useState<null | { x: number; y: number }>(null);
  const isError = status === 'error';
  const { preview: contextPreview } = React.useContext(context);

  let mergedPreview = contextPreview || preview;

  if (!preview) {
    mergedPreview = false;
  } else if (typeof preview === 'object' && typeof contextPreview === 'object') {
    mergedPreview = {
      ...contextPreview,
      ...preview,
    };
  }

  const onLoad = () => {
    setStatus('normal');
  };

  const onError = () => {
    setStatus('error');
  };

  const onPreview: React.MouseEventHandler<HTMLDivElement> = e => {
    const { left, top } = getOffset(e.target);

    setShowPreview(true);
    setMousePosition({
      x: left,
      y: top,
    });

    if (onClick) onClick(e);
  };

  const onPreviewClose = (e: React.SyntheticEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setShowPreview(false);
    setMousePosition(null);

    if (onInitialPreviewClose) onInitialPreviewClose(e);
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
  };

  return (
    <div
      {...otherProps}
      className={className}
      onClick={mergedPreview && !isError ? onPreview : onClick}
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
      {mergedPreview && !isError && (
        <Preview
          aria-hidden={!isShowPreview}
          visible={isShowPreview}
          prefixCls={previewPrefixCls}
          onClose={onPreviewClose}
          mousePosition={mousePosition}
          src={mergedSrc}
          alt={alt}
          {...mergedPreview}
        />
      )}
    </div>
  );
};

ImageInternal.Group = Group;

ImageInternal.displayName = 'Image';

export default ImageInternal;
