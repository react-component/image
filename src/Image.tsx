import * as React from 'react';
import cn from 'classnames';
import { getOffset } from 'rc-util/lib/Dom/css';
import Preview from './Preview';
import useSetState from './hooks/useSetState';

export interface ImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'placeholder'> {
  // Original
  src?: string;

  prefixCls?: string;
  placeholder?: React.ReactNode;
  fallback?: string;
  preview?: boolean;
  onPreviewClose?: (e: React.SyntheticEvent<HTMLDivElement | HTMLLIElement>) => void;
}

interface ImageState {
  isShowPreview: boolean;
  isShowPlaceholder: boolean;
  isError: boolean;
  mousePosition: null | { x: number; y: number };
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
  preview = true,
  ...otherProps
}) => {
  const [state, setState] = useSetState<ImageState>({
    isShowPreview: false,
    isError: false,
    isShowPlaceholder: placeholder !== undefined,
    mousePosition: null,
  });

  const onLoad = () => {
    if (!state.isError) {
      setState({
        isShowPlaceholder: false,
      });
    }
  };

  const onError = () => {
    setState({
      isError: true,
      isShowPlaceholder: false,
    });
  };

  const onPreview: React.MouseEventHandler<HTMLImageElement> = e => {
    const { left, top } = getOffset(e.target);

    setState({
      isShowPreview: true,
      mousePosition: {
        x: left,
        y: top,
      },
    });
  };

  const onPreviewClose = (e: React.SyntheticEvent<HTMLDivElement>) => {
    e.stopPropagation();

    setState({
      isShowPreview: false,
      mousePosition: null,
    });

    if (onInitialPreviewClose) onInitialPreviewClose(e);
  };

  React.useEffect(() => {
    if (placeholder) {
      setState({
        isShowPlaceholder: true,
      });
    }
  }, [src]);

  const className = cn(prefixCls, {
    [`${prefixCls}-error`]: state.isError,
  });

  const mergedSrc = state.isError && fallback ? fallback : src;

  return (
    <div
      className={`${prefixCls}-wrapper`}
      onClick={preview ? onPreview : null}
      style={{
        width,
        height,
      }}
    >
      <img
        {...otherProps}
        src={mergedSrc}
        onLoad={onLoad}
        onError={onError}
        alt={alt}
        className={className}
        width={width}
        height={height}
      />
      {state.isShowPlaceholder && <div className={`${prefixCls}-placeholder`}>{placeholder}</div>}
      {preview && (
        <Preview
          visible={state.isShowPreview}
          prefixCls={`${prefixCls}-preview`}
          onClose={onPreviewClose}
          mousePosition={state.mousePosition}
          src={mergedSrc}
          alt={alt}
        />
      )}
    </div>
  );
};

export default ImageInternal;
