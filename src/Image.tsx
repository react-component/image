import * as React from 'react';
import classnames from 'classnames';
// import { parse } from 'srcset';
import { polyfill } from 'react-lifecycles-compat';

import { isRetina, saveRef } from './util';
import { IImageProps } from './PropTypes';

export interface IImageState {
  loaded: boolean;
  error: boolean;
}

class Image extends React.Component<Partial<IImageProps>, IImageState> {
  public static displayName = 'Image';
  public static defaultProps = {
    prefixCls: 'rc-image',
    onLoad: () => {},
    onError: () => {},
  }
  public onImageLoad = () => {
    const { onLoad } = this.props;
    this.setState({
      loaded: true,
    }, () => {
      onLoad();
    })
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
  public divRef: HTMLInputElement | null = null;
  constructor(props: Partial<IImageProps>) {
    super(props);
    this.saveImageRef = saveRef(this, 'imageRef');
    this.saveDivRef = saveRef(this, 'divRef');
    this.state = {
      error: false,
      loaded: false,
    }
  }
  public componentWillReceiveProps(nextProps: IImageProps) {
    if (nextProps.src !== this.props.src) {
      this.setState({
        error: false,
        loaded: false,
      });
    }
  };
  public componentDidMount() {
  //  console.log('----this.props-----', this.props) ;
  //  const { srcSet } = this.props;
  //  if (srcSet && !his.imageRef.hasAttribute('srcset')) {
    // const = parse(srcSet);
  //  }
  //  console.log(this.imageRef.hasAttribute('srcset'));
  //  this.imageRef
  }
  public render() {
    const { className, prefixCls, src, srcSet, alt, responsive, children } = this.props;
    const rootCls = {
      [className as string]: !!className,
      [prefixCls as string]: 1,
      [`${prefixCls}-responsive`]: !!responsive,
    };
    const { loaded } = this.state;
    // console.log('---isRetina-', isRetina(), 'loaded', loaded);
    return (
      <img
        ref={this.saveImageRef}
        className={classnames(rootCls)}
        src={src}
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
