import * as React from 'react';

import { IPreviewProps } from '../PropTypes';
import Img from './Img';

export interface IPreviewState {
  zoom: boolean;
  rotate: number;
}

export default class Preview extends React.Component<IPreviewProps, Partial<IPreviewState>> {
  constructor(props: IPreviewProps) {
    super(props);
    this.state = {
      rotate: 0,
      zoom: false,
    };
  }
  public componentDidMount() {
    setTimeout(this.mountSelf, 0);
  }
  public componentWillUnmount() {
    window.addEventListener('scroll', this.handleScroll);
  }
  public mountSelf = () => {
    const { cover } = this.props;
    // hidden
    cover.style.visibility = 'hidden';
    // bind scrollEvent
    window.addEventListener('scroll', this.handleScroll);
  };
  public handleScroll = () => {
    this.unMountSelf();
  };
  public unMountSelf = () => {
    const { cover, handlePreview } = this.props;
    cover.style.visibility = 'visible';
    if (handlePreview) {
      handlePreview(false);
    }
  };

  public render() {
    const { cover, prefixCls } = this.props;
    const { zoom = false, rotate = 0 } = this.state;
    console.log('--this.state---', this.state);
    return (
      <div className={`${prefixCls}-preview`}>
        <div className={`${prefixCls}-preview-bg`} />
        <Img cover={cover} prefixCls={prefixCls} rotate={rotate} zoom={zoom} edge={20} radius={0} />
      </div>
    );
  }
}
