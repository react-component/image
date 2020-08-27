import * as React from 'react';
import { useState } from 'react';
import cn from 'classnames';
import { getOffset } from 'rc-util/lib/Dom/css';
import Preview from './Preview';
import Group from './group';
import context from './context';

export interface ImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'placeholder' | 'onClick'> {
  // Original
  src?: string;

  prefixCls?: string;
  previewPrefixCls?: string;
  placeholder?: React.ReactNode;
  fallback?: string;
  preview?: boolean;
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
  prefixCls: localPrefixCls,
  previewPrefixCls: localPreviewPrefixCls,
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
  const {
    prefixCls: contextPrefixCls,
    previewPrefixCls: contextPreviewPrefixCls,
    mergedPreview,
    previewUrls,
    setPreviewUrls,
    setCurrent,
    setShowPreview: setGroupShowPreview,
    setMousePosition: setGroupMousePosition,
  } = React.useContext(context);

  const groupIndexRef = React.useRef(0);

  const prefixCls = localPrefixCls || contextPrefixCls || 'rc-image';

  const previewPrefixCls =
    localPreviewPrefixCls || contextPreviewPrefixCls || `${prefixCls}-preview`;

  const onLoad = () => {
    setStatus('normal');
  };

  const onError = () => {
    setStatus('error');
    if (mergedPreview) {
      previewUrls.splice(groupIndexRef.current);
      setPreviewUrls(previewUrls);
    }
  };

  const onPreview: React.MouseEventHandler<HTMLDivElement> = e => {
    const { left, top } = getOffset(e.target);

    if (mergedPreview) {
      setCurrent(src);
      setGroupShowPreview(true);
      setGroupMousePosition({
        x: left,
        y: top,
      });
    } else {
      setShowPreview(true);
      setMousePosition({
        x: left,
        y: top,
      });
    }

    if (onClick) onClick(e);
  };

  const onPreviewClose = (e: React.SyntheticEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setShowPreview(false);
    setMousePosition(null);

    if (onInitialPreviewClose) onInitialPreviewClose(e);
  };

  React.useEffect(() => {
    if (mergedPreview && previewUrls.indexOf(src) < 0) {
      groupIndexRef.current = previewUrls.length;
      previewUrls.push(src);
      setPreviewUrls(previewUrls);
    }
  }, [previewUrls]);

  React.useEffect(() => {
    if (isCustomPlaceholder) {
      setStatus('loading');
    }
    return () => {
      setPreviewUrls(previewUrls.filter(url => url !== src));
    };
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
      {!mergedPreview && preview && !isError && (
        <Preview
          aria-hidden={!isShowPreview}
          visible={isShowPreview}
          prefixCls={previewPrefixCls}
          onClose={onPreviewClose}
          mousePosition={mousePosition}
          src={mergedSrc}
          alt={alt}
        />
      )}
    </>
  );
};

ImageInternal.Group = Group;

ImageInternal.displayName = 'Image';

export default ImageInternal;
