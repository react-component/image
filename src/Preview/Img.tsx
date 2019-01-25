import classNames from 'classnames';
import * as React from 'react';

import {
  getClientHeight,
  getClientWidth,
  // getScrollHeight,
  getScrollWidth,
  getWindowHeight,
  saveRef,
} from '../util';

import { ImgProps } from '../PropTypes';

interface ICoverStyle {
  x: number;
  y: number;
  opacity: number;
  scale: number;
  rotate: number;
}

interface IImgState {
  currentStyle: Partial<ICoverStyle> | null;
}

export default class Img extends React.Component<ImgProps, IImgState> {
  public savePreviewImgRef: (ref: HTMLImageElement) => void;
  public previewImgRef: HTMLImageElement | null = null;
  constructor(props: ImgProps) {
    super(props);
    this.state = {
      currentStyle: this.getCoverStyle(),
    };
    this.savePreviewImgRef = saveRef(this, 'previewImgRef');
  }
  // init position
  public getCoverStyle = () => {
    const { cover, rotate } = this.props;
    const { naturalWidth } = cover;
    const {
      top,
      left,
      right,
      bottom,
      width: coverWidth,
      height: coverHeight,
    } = cover.getBoundingClientRect();
    // support IE
    const width = coverWidth || right - left;
    const height = coverHeight || bottom - left;
    const { opacity } = window.getComputedStyle(cover);
    const scale = width / naturalWidth;

    const coverStyle: Partial<ICoverStyle> = {
      x: -getScrollWidth() / 2 + left + width / 2,
      y: -getWindowHeight() / 2 + top + height / 2,
      // tslint:disable-next-line
      opacity: opacity ? ~~opacity : 1,
      scale,
      rotate: rotate - (rotate % 360),
    };
    return coverStyle;
  };
  public getBrowsingStyle = () => {
    const { edge, rotate } = this.props;
    if (this.previewImgRef) {
      const { naturalWidth, naturalHeight } = this.previewImgRef;
      const scaleX = getClientWidth() / (naturalWidth + 2 * edge);
      const scaleY = getClientHeight() / (naturalHeight + 2 * edge);
      const scale = Math.min(scaleX, scaleY);
      return {
        x: 0,
        y: 0,
        opacity: 1,
        scale,
        rotate,
      };
    }
    return {};
  };
  public getZoomingStyle = () => {
    const { edge = 0, rotate } = this.props;
    if (this.previewImgRef) {
      const { naturalWidth, naturalHeight } = this.previewImgRef;
      const sw = getScrollWidth();
      const wh = getWindowHeight();
      const mouseX = sw / 2;
      const mouseY = wh / 2;
      const rangeX = naturalWidth - sw + 2 * edge;
      const rangeY = naturalHeight - wh + 2 * edge;

      const imagePosX =
        naturalWidth > sw ? (naturalWidth - sw) / 2 + edge - rangeX * (mouseX / sw) : 0;
      const imagePosY =
        naturalHeight > wh ? (naturalHeight - wh) / 2 + edge - rangeY * (mouseY / wh) : 0;
      return {
        x: imagePosX,
        y: imagePosY,
        opacity: 1,
        scale: 1,
        rotate,
      };
    }
    return {};
  };

  public updateCurrentStyle = () => {
    const { isZoom } = this.props;
    const currentStyle = isZoom ? this.getZoomingStyle() : this.getBrowsingStyle();
    if (currentStyle) {
      this.setState({
        currentStyle,
      });
    }
  };
  public render() {
    const { prefixCls, isZoom, cover } = this.props;
    const { currentStyle } = this.state;
    console.log('----currentStyle-', currentStyle);
    const transform = currentStyle
      ? `translate(-50%, -50%) translate(${currentStyle.x}px, ${currentStyle.y}px) scale(${
          currentStyle.scale
        }, ${currentStyle.scale}) rotate(${currentStyle.rotate}deg)`
      : '';
    console.log('--transform----', transform);
    const previewImageCls = classNames(cover.className, `${prefixCls}-preview-image`);
    return (
      <img
        className={previewImageCls}
        style={{
          transform,
          msTransform: transform,
          WebkitTransform: transform,
          OTransform: transform,
          cursor: isZoom ? 'zoom-out' : 'initial',
        }}
        src={cover.src}
        alt={cover.alt}
        onLoad={this.updateCurrentStyle}
        ref={this.savePreviewImgRef}
      />
    );
  }
}
