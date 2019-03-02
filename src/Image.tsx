import classnames from 'classnames';
import * as React from 'react';
import { polyfill } from 'react-lifecycles-compat';

import { saveRef } from './util';

interface ImageState {
  loaded?: boolean;
  error?: boolean;
}

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  prefixCls?: string;
  errorSrc?: string;
  placeholde?: React.ReactElement<any>;
  onLoad?: () => void;
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
  public saveImageRef: (ref: HTMLImageElement) => void;
  public imageRef: HTMLImageElement | null = null;
  constructor(props: ImageProps) {
    super(props);
    this.saveImageRef = saveRef(this, 'imageRef');
    this.state = {
      loaded: false,
      error: false,
    };
  }
  public handleImageLoad = () => {
    const { onLoad } = this.props;
    if (onLoad) {
      this.setState({
        loaded: true,
      }, () => {
        onLoad();
      })
    }
  };
  public handleImageError = () => {
    const { src, onError } = this.props;
    if (src) {
      this.setState({
        error: true,
      }, () => {
        if (onError) {
          onError();
        }
      });
    }
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
      ...restProps
    } = this.props;
    const { error, loaded } = this.state;
    const rootCls = classnames({
      [className as string]: !!className,
      [prefixCls as string]: true,
    });
    const imgSrc = error ? errorSrc : src;
    return (
      <React.Fragment>
        <img
          {...restProps}
          ref={this.saveImageRef}
          className={rootCls}
          src={imgSrc}
          style={style}
          srcSet={srcSet}
          alt={alt}
          onLoad={this.handleImageLoad}
          onError={this.handleImageError}
        />
        {!loaded && React.isValidElement(placeholder) &&
          React.cloneElement(placeholder)
        }

      </React.Fragment>
    );
  }
}

polyfill(RcImage);

export default RcImage;
