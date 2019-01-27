import * as React from 'react';

import { IPreviewProps } from '../PropTypes';
import Img from './Img';

export interface IPreviewState {
  isZoom: boolean;
  rotate: number;
  show: boolean;
}

export default class Preview extends React.Component<IPreviewProps, Partial<IPreviewState>> {
  constructor(props: IPreviewProps) {
    super(props);
    this.state = {
      rotate: 0,
      isZoom: false,
      show: false,
    };
  }
  public componentDidMount() {
    setTimeout(this.mountPreview, 0);
  }
  public componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }
  public mountPreview = () => {
    const { cover } = this.props;
    this.setState(
      {
        show: true,
      },
      () => {
        // hidden
        cover.style.visibility = 'hidden';
        // bind scrollEvent
        window.addEventListener('scroll', this.handleScroll);
      },
    );
  };
  public handleScroll = () => {
    if (this.state.show) {
      this.unMountPreview();
    }
  };
  public unMountPreview = () => {
    this.setState({
      show: false,
    });
  };

  public render() {
    const { cover, prefixCls, zoom, handlePreview } = this.props;
    const { isZoom, rotate = 0, show } = this.state;
    return (
      <div className={`${prefixCls}-preview`}>
        <div
          onClick={this.unMountPreview}
          className={`${prefixCls}-preview-bg`}
          style={{
            opacity: show ? 1 : 0,
          }}
        />
        <Img
          cover={cover}
          show={show}
          prefixCls={prefixCls}
          rotate={rotate}
          zoom={zoom}
          isZoom={isZoom}
          edge={20}
          radius={0}
          handlePreview={handlePreview}
        />
      </div>
    );
  }
}
