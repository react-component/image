import * as React from 'react';
import { useState } from 'react';
import cn from 'classnames';
import { getOffset } from 'rc-util/lib/Dom/css';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import { GetContainer } from 'rc-util/lib/PortalWrapper';
import Preview from './Preview';
import PreviewGroup, { context } from './PreviewGroup';

export interface ImagePreviewType {
  visible?: boolean;
  onVisibleChange?: (value: boolean, prevValue: boolean) => void;
  getContainer?: GetContainer | false;
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
  preview?: boolean | ImagePreviewType;
  /**
   * @deprecated since version 3.2.1
   */
  onPreviewClose?: (value: boolean, prevValue: boolean) => void;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

interface CompoundedComponent<P> extends React.FC<P> {
  PreviewGroup: typeof PreviewGroup;
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
  className,
  onClick,
  wrapperClassName,
  wrapperStyle,

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
  const {
    isPreviewGroup,
    previewUrls,
    setPreviewUrls,
    setCurrent,
    setShowPreview: setGroupShowPreview,
    setMousePosition: setGroupMousePosition,
  } = React.useContext(context);

  const groupIndexRef = React.useRef(0);
  const imgRef = React.useRef<HTMLImageElement>(null);

  const isLoaded = (img?: HTMLImageElement) =>
    img?.complete && (img.naturalWidth || img.naturalHeight);

  const onLoad = () => {
    setStatus('normal');
  };

  const onError = () => {
    setStatus('error');
    if (isPreviewGroup) {
      previewUrls.splice(groupIndexRef.current);
      setPreviewUrls(previewUrls);
    }
  };

  const onPreview: React.MouseEventHandler<HTMLDivElement> = e => {
    if (!isControlled) {
      const { left, top } = getOffset(e.target);

      if (isPreviewGroup) {
        setCurrent(src);
        setGroupMousePosition({
          x: left,
          y: top,
        });
      } else {
        setMousePosition({
          x: left,
          y: top,
        });
      }
    }

    if (isPreviewGroup) {
      setGroupShowPreview(true);
    } else {
      setShowPreview(true);
    }

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
    if (isPreviewGroup && previewUrls.indexOf(src) < 0) {
      groupIndexRef.current = previewUrls.length;
      previewUrls.push(src);
      setPreviewUrls(previewUrls);
    }
  }, [previewUrls]);

  React.useEffect(() => {
    if (isCustomPlaceholder) {
      setStatus(isLoaded(imgRef.current) ? 'normal' : 'loading');
    }
    return () => {
      setPreviewUrls(previewUrls.filter(url => url !== src));
    };
  }, [src]);

  const wrappperClass = cn(prefixCls, wrapperClassName, {
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
    className: cn(
      `${prefixCls}-img`,
      {
        [`${prefixCls}-img-placeholder`]: placeholder === true,
      },
      className,
    ),
    style: {
      height,
      ...style,
    },
  };

  return (
    <>
      <div
        {...otherProps}
        className={wrappperClass}
        onClick={preview && !isError ? onPreview : onClick}
        style={{
          width,
          height,
          ...wrapperStyle,
        }}
      >
        {isError && fallback ? (
          <img {...imgCommonProps} src={fallback} />
        ) : (
          <img {...imgCommonProps} onLoad={onLoad} onError={onError} src={src} ref={imgRef} />
        )}

        {status === 'loading' && (
          <div aria-hidden="true" className={`${prefixCls}-placeholder`}>
            {placeholder}
          </div>
        )}
      </div>
      {!isPreviewGroup && preview && !isError && (
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

ImageInternal.PreviewGroup = PreviewGroup;

ImageInternal.displayName = 'Image';

export default ImageInternal;
