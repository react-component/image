import * as React from 'react';
import classnames from 'classnames';
import { polyfill } from 'react-lifecycles-compat';

import { saveRef } from './util';
import { IImageProps } from './PropTypes';

export interface IImageState {
  error: boolean;
}

class Image extends React.Component<Partial<IImageProps>, IImageState> {
  public static displayName = 'Image';
  public static defaultProps = {
    prefixCls: 'rc-image',
    errorSrc: 'error',
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
  constructor(props: Partial<IImageProps>) {
    super(props);
    this.saveImageRef = saveRef(this, 'imageRef');
    this.saveDivRef = saveRef(this, 'divRef');
    this.state = {
      error: false,
    }
  }
  public componentWillReceiveProps(nextProps: IImageProps) {
    if (nextProps.src !== this.props.src) {
      this.setState({
        error: false,
      });
    }
  };
  public renderPlaceholder() {
    const { prefixCls, placeholder } = this.props;
    if (!placeholder) return null;
    return (
      <div className={`${prefixCls}-placeholder`}>
        {placeholder}
      </div>
    );
  }
  public render() {
    const { className, errorSrc, prefixCls, src, srcSet, alt, responsive, style } = this.props;
    const { error } = this.state;
    const rootCls = {
      [className as string]: !!className,
      [prefixCls as string]: 1,
      [`${prefixCls}-responsive`]: !!responsive,
    };
    const imgSrc = error ? errorSrc : src;
    return (
      <img
        ref={this.saveImageRef}
        className={classnames(rootCls)}
        src={imgSrc}
        style={style}
        srcSet={srcSet}
        onLoad={this.onImageLoad}
        onError={this.onImageError}
        alt={alt}
      />
    );
  }
}

polyfill(Image);

export default Image;
