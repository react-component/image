import * as React from 'react';

import Img from './Img';
import { PreviewProps } from '../PropTypes';

export interface PreviewState {
  zoom?: boolean;
  rotate?: number;
}

export default class Preview extends React.Component<PreviewProps, PreviewState> {
  constructor(props) {
    super(props);
    this.state = {
      rotate: 0,
      zoom: false,
    }
  }
  componentDidMount() {
    setTimeout(this.mountSelf, 0)
  }
  componentWillUnmount() {
    window.addEventListener('scroll', this.handleScroll)
  }
  public mountSelf = () => {
    const { cover } = this.props
    debugger;
    // hidden
    cover.style.visibility = 'hidden'
    // bind scrollEvent
    window.addEventListener('scroll', this.handleScroll)
  }
  public handleScroll = () => {
    this.unMountSelf();
  }
  public unMountSelf = () => {
    const { cover } = this.props
    cover.style.visibility = 'visible'
    this.props.handlePreview(false);
  }

  render() {
    const { cover, prefixCls } = this.props;
    const { zoom, rotate } = this.state;
    console.log('--this.state---', this.state);
    return (
      <div className={`${prefixCls}-preview`}>
        <div className={`${prefixCls}-preview-bg`} />
        <Img
          cover={cover}
          prefixCls={prefixCls}
          rotate={rotate}
          zoom={zoom}
          edge={20}
        />
      </div>
    )
  }
}
