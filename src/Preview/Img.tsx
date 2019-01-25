import * as React from 'react';

import { getClientHeight, getClientWidth, getScrollHeight, getScrollWidth, getWindowHeight, saveRef } from '../util';

import { ImgProps } from '../PropTypes';

interface ICoverStyle {
  x: number;
  y: number;
  opacity: number;
  scale: number;
  rotate: number;
  borderRadius: number;
}

interface IImgState {
  currentStyle: Partial<ICoverStyle>;
}

export default class Img extends React.Component<ImgProps, IImgState> {
  public savePreviewImgRef: (ref: HTMLImageElement) => void;
  public previewImgRef: HTMLImageElement | null = null;
  constructor(props: ImgProps) {
    super(props);
    this.savePreviewImgRef = saveRef(this, 'previewImgRef');
    const currentStyle = this.getCoverStyle();
    this.state = {
      currentStyle,
    }
  }
  public getCoverStyle = () => {
    const { cover, rotate } = this.props
    const { naturalWidth } = cover;
    const { top, left, width, height } = cover.getBoundingClientRect();
    const { opacity, borderRadius } = window.getComputedStyle(cover);
    const coverStyle: Partial<ICoverStyle> = {
      x: -getScrollHeight() / 2 + left + width / 2,
      y: -getWindowHeight() / 2 + top + height / 2,
      // tslint:disable-next-line
      opacity: opacity ? ~~opacity : 1,
      scale: width / naturalWidth,
      rotate: rotate - rotate % 360,
      borderRadius: borderRadius ? +borderRadius : 0,
    }
    return coverStyle;
  }
  public getBrowsingStyle = () => {
    const { radius = 0, edge = 0, rotate = 0 } = this.props
    if (this.previewImgRef) {
      const { naturalWidth, naturalHeight } = this.previewImgRef;
      const scaleX = getClientWidth() / (naturalWidth + 2 * edge)
      const scaleY = getClientHeight() / (naturalHeight + 2 * edge)
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
    return {};
  }
  public getZoomingStyle = () => {
    const { edge = 0, rotate } = this.props;
    if (this.previewImgRef) {
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
    return {};
  }

  public updateCurrentStyle = () => {
    const { zoom } = this.props;
    const currentStyle = zoom ? this.getZoomingStyle() : this.getBrowsingStyle();
    if (currentStyle) {
      this.setState({
        currentStyle,
      });
    }
  }
  public render() {
    const { prefixCls, zoom, cover } = this.props;
    const { currentStyle } = this.state;
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
