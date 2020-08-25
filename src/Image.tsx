import * as React from 'react';
import { useState, useRef } from 'react';
import cn from 'classnames';
import { getOffset } from 'rc-util/lib/Dom/css';
import Preview, { PreviewProps } from './Preview';

export type Preview =
  | boolean
  | {
      urls?: PreviewProps['urls'];
      current?: PreviewProps['current'];
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
  groupKey?: string;
}

type ImageStatus = 'normal' | 'error' | 'loading';

const groupCache = new Map<string, Set<string>>();

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
  groupKey,

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
  const groupKeyRef = useRef<string>(groupKey);
  const srcRef = useRef<string>(src);
  const urls = typeof preview === 'object' && Array.isArray(preview.urls) ? preview.urls : [];
  const [groupUrls, setGroupUrls] = useState<string[]>([...(groupCache.get(groupKey) || [])]);

  const onLoad = () => {
    setStatus('normal');
  };

  const onError = () => {
    setStatus('error');
  };

  const onPreview: React.MouseEventHandler<HTMLDivElement> = e => {
    const { left, top } = getOffset(e.target);

    setGroupUrls([...(groupCache.get(groupKey) || [])]); // 因为groupCache数据受其他Image影响，触发需要使用最新的数据
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
    if (groupKey !== groupKeyRef.current || src !== srcRef.current) {
      const set = groupCache.get(groupKeyRef.current);
      if (set) {
        set.delete(srcRef.current);
      }
      groupKeyRef.current = groupKey;
      srcRef.current = src;
    }
    if (groupKey && src) {
      let set = groupCache.get(groupKey);
      if (set) {
        if (!set.has(src)) {
          set.add(src);
        }
      } else {
        set = new Set();
        set.add(src);
        groupCache.set(groupKey, set);
      }
    }

    return () => {
      groupCache.forEach((set, key) => {
        if (set || set.size === 0) {
          groupCache.delete(key);
        } else if (key === groupKey) {
          set.delete(src);
          groupCache.set(key, set);
        }
      });
    };
  }, [src, groupKey]);

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

  const mergedUrls = [...new Set([...urls, ...groupUrls])];

  return (
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
      {preview && !isError && (
        <Preview
          aria-hidden={!isShowPreview}
          visible={isShowPreview}
          prefixCls={previewPrefixCls}
          onClose={onPreviewClose}
          mousePosition={mousePosition}
          src={mergedSrc}
          alt={alt}
          {...preview}
          urls={mergedUrls}
        />
      )}
    </div>
  );
};

ImageInternal.displayName = 'Image';

export default ImageInternal;
