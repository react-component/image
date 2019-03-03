import cls from 'classnames';
import * as React from 'react';
import { polyfill } from 'react-lifecycles-compat';

import Preview from './Preview';

interface ImageState {
  loaded?: boolean;
  error?: boolean;
  isZoom?: boolean;
  mousePosition: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
}

export interface ImageProps {
  src?: string;
  alt?: string;
  crossOrigin?: 'anonymous' | 'use-credentials' | '';
  decoding?: 'async' | 'auto' | 'sync';
  height?: number | string;
  sizes?: string;
  srcSet?: string;
  useMap?: string;
  width?: number | string;

  wrapClassName?: string;
  className?: string;
  prefixCls?: string;
  errorSrc?: string;
  placeholder?: React.ReactElement<any>;
  style?: React.CSSProperties;
  zoom?: {};
  onLoad?: () => void;
  onClick?: (e: React.MouseEvent<HTMLImageElement>) => void;
  onError?: () => void;
}

class RcImage extends React.Component<ImageProps, ImageState> {
  public static displayName = 'RcImage';
  public static defaultProps = {
    prefixCls: 'rc-image',
    errorSrc: 'error',
    onLoad: () => null,
    onError: () => null,
  };
  public imageRef: HTMLImageElement | null = null;
  constructor(props: ImageProps) {
    super(props);
    this.state = {
      loaded: false,
      error: false,
      isZoom: false,
      size: {
        width: 0,
        height: 0,
      },
      mousePosition: {
        x: 0,
        y: 0,
      },
    };
  }
  public saveImageRef = (node: HTMLImageElement): void => {
    if (node) {
      this.imageRef = node;
    }
  };
  public onImageLoad = () => {
    const { onLoad } = this.props;
    if (onLoad) {
      this.setState(
        {
          loaded: true,
        },
        () => {
          onLoad();
        },
      );
    }
  };
  public onImageError = () => {
    const { src, onError } = this.props;
    if (src) {
      this.setState(
        {
          error: true,
        },
        () => {
          if (onError) {
            onError();
          }
        },
      );
    }
  };
  public onImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    const { onClick, zoom } = this.props;
    if (onClick) {
      onClick(e);
    }
    if (zoom) {
      const { width, height, left, top } = (this
        .imageRef as HTMLImageElement).getBoundingClientRect();
      console.log('---width-', width, 'height', height);
      this.setState({
        isZoom: true,
        size: {
          width,
          height,
        },
        mousePosition: {
          x: left,
          y: top,
        },
      });
    }
  };
  public onCloseImageZoom = (e: React.SyntheticEvent) => {
    this.setState({
      isZoom: false,
    });
  };
  public render() {
    const {
      className,
      errorSrc,
      prefixCls,
      placeholder,
      src,
      srcSet,
      alt,
      style,
      zoom,
      wrapClassName,
      ...restProps
    } = this.props;
    const { error, loaded, isZoom, mousePosition, size } = this.state;
    const wrapperCls = cls({
      [wrapClassName as string]: !!wrapClassName,
      [`${prefixCls}-wrapper`]: true,
    });
    const rootCls = cls({
      [className as string]: !!className,
      [prefixCls as string]: true,
      [`${prefixCls}-error`]: error,
      [`${prefixCls}-zoom`]: isZoom,
    });
    const imgSrc = error && errorSrc ? errorSrc : src;
    const renderPlaceHolder = () => {
      console.log(
        '---this.imageRef-',
        this.imageRef,
        placeholder,
        React.isValidElement(placeholder),
      );
      if (!React.isValidElement(placeholder) || loaded || error) {
        return null;
      }
      const placeHolderProps = {
        style: {
          ...style,
          position: 'absolute',
          top: 0,
          left: 0,
        },
        className,
      };
      return React.cloneElement(placeholder, placeHolderProps);
    };
    return (
      <React.Fragment>
        <div className={wrapperCls}>
          <img
            {...restProps}
            ref={this.saveImageRef}
            className={rootCls}
            src={imgSrc}
            style={style}
            srcSet={srcSet}
            alt={alt}
            onLoad={this.onImageLoad}
            onError={this.onImageError}
            onClick={this.onImageClick}
          />
          {renderPlaceHolder()}
        </div>
        {!error && (
          <Preview
            prefixCls={prefixCls}
            visible={isZoom}
            onClose={this.onCloseImageZoom}
            src={src}
            mousePosition={mousePosition}
            size={size}
            alt={alt}
          />
        )}
      </React.Fragment>
    );
  }
}

polyfill(RcImage);

export default RcImage;
