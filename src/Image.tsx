import * as React from 'react';
import classnames from 'classnames';
import { polyfill } from 'react-lifecycles-compat';

import { saveRef } from './util';
import { ImageProps } from './PropTypes';

export interface ImageState {
  error?: boolean;
  preview?: boolean;
}

class Image extends React.Component<Partial<ImageProps>, ImageState> {
  public static displayName = 'Image';
  public static defaultProps = {
    prefixCls: 'rc-image',
    errorSrc: 'error',
    preview: false,
    onLoad: () => {},
    onError: () => {},
  }
  public onImageLoad = () => {
    const { onLoad } = this.props;
    onLoad();
  }
  public onImageError = (err: React.SyntheticEvent) => {
    const { src, onError } = this.props;
    if (src) {
      this.setState({
        error: true,
      }, () => {
        onError();
      })
    }
  }
  public saveImageRef: (ref: HTMLImageElement) => void;
  public imageRef: HTMLInputElement | null = null;
  public saveDivRef: (ref: HTMLDivElement) => void;
  public divRef: HTMLDivElement | null = null;
  constructor(props: Partial<ImageProps>) {
    super(props);
    this.saveImageRef = saveRef(this, 'imageRef');
    this.saveDivRef = saveRef(this, 'divRef');
    this.state = {
      error: false,
    }
  }
  componentWillReceiveProps(nextProps: ImageProps) {
    if (nextProps.preview && nextProps.preview !== this.props.preview) {
      this.setState({
        preview: true,
      })
    }
  };
  public render() {
    const { className, errorSrc, prefixCls, src, srcSet, alt, responsive, style, ...restProps } = this.props;
    const { error } = this.state;
    const rootCls = {
      [className as string]: !!className,
      [prefixCls as string]: 1,
      [`${prefixCls}-responsive`]: !!responsive,
    };
    const imgSrc = error ? errorSrc : src;
    console.log('---imgSrc---', imgSrc);
    return (
      <React.Fragment>
        <img
          {...restProps}
          ref={this.saveImageRef}
          className={classnames(rootCls)}
          src={imgSrc}
          style={style}
          srcSet={srcSet}
          onLoad={this.onImageLoad}
          onError={this.onImageError}
          alt={alt}
        />

      </React.Fragment>
    );
  }
}

polyfill(Image);

export default Image;
