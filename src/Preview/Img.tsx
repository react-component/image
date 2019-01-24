import * as React from 'react';

import { saveRef, getScrollHeight, getScrollWidth, getWindowHeight, getClientWidth, getClientHeight } from '../util';

export default class Img extends React.Component<any, any> {
  public savePreviewImgRef: (ref: HTMLImageElement) => void;
  public previewImgRef: HTMLImageElement | null = null;
  public getCoverStyle = () => {
    const { cover, rotate } = this.props
    debugger;
    const { naturalWidth } = cover;
    const { top, left, width, height } = cover.getBoundingClientRect();
    const { opacity, borderRadius } = window.getComputedStyle(cover);
    const coverStyle = {
      x: -getScrollHeight() / 2 + left + width / 2,
      y: -getWindowHeight() / 2 + top + height / 2,
      opacity: ~~opacity || 1,
      scale: width / naturalWidth,
      rotate: rotate - rotate % 360,
      borderRadius,
    }
    debugger;
    return coverStyle;
  }
  constructor(props) {
    super(props);
    this.savePreviewImgRef = saveRef(this, 'previewImgRef');
    const currentStyle = this.getCoverStyle();
    this.state = {
      currentStyle,
    }
  }
  public getCurrentImageStyle = () => {
    const { zoom } = this.props;
    if (zoom) {
      return this.getZoomingStyle();
    } else {
      return this.getBrowsingStyle();
    }
  }
  public getBrowsingStyle = () => {
    const { radius, edge, rotate } = this.props
    const { naturalWidth, naturalHeight } = this.previewImgRef;
    const scaleX = getClientWidth() / (naturalWidth + 2*edge)
    const scaleY = getClientHeight() / (naturalHeight + 2*edge)
    const scale = Math.min(scaleX, scaleY);
    return {
      x: 0,
      y: 0,
      opacity: 1,
      scale,
      rotate,
      borderRadius: radius
    }
  }
  public getZoomingStyle = () => {
    const { edge, rotate } = this.props;
    const { naturalWidth, naturalHeight } = this.previewImgRef;
    const sw = getScrollWidth();
    const wh = getWindowHeight();
    const mouseX = sw / 2;
    const mouseY = wh / 2;
    const rangeX = naturalWidth - sw + (2 * edge);
    const rangeY = naturalHeight - wh + (2 * edge);

    const imagePosX = naturalWidth > sw ? ((naturalWidth - sw) / 2 + edge) - (rangeX * ( mouseX / sw)) : 0;
    const imagePosY = naturalHeight > wh ? ((naturalHeight - wh)/2 + edge) - (rangeY*(mouseY / wh)) : 0;
    return {
      x: imagePosX,
      y: imagePosY,
      opacity: 1,
      scale: 1,
      rotate,
      borderRadius: 0
    }
  }

  public updateCurrentStyle = () => {
    const currentStyle = this.getCurrentImageStyle();
    this.setState({
      currentStyle,
    });
  }
  render() {
    const { prefixCls, zoom, cover } = this.props;
    const { currentStyle } = this.state;
    debugger;
    const { src, alt } = cover;
    console.log('---currentStyle-----', currentStyle);
    return (
      <img
        className={`${prefixCls}-preview-image`}
        style={{
          transform: `translate3d(-50%, -50%, 0) translate3d(${currentStyle.x}px, ${currentStyle.y}px, 0px) scale3d(${currentStyle.scale}, ${currentStyle.scale}, 1) rotate3d(0, 0, 1, ${currentStyle.rotate}deg)`,
          cursor: zoom ? 'zoom-out' : 'initial',
        }}
        src={src}
        alt={alt}
        onLoad={this.updateCurrentStyle}
        ref={this.savePreviewImgRef}
      />
    )
  }
}
