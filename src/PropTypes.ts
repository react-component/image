
// import * as PropTypes from 'prop-types';
import * as React from 'react';

// crossOrigin?: "anonymous" | "use-credentials" | "";
// decoding?: "async" | "auto" | "sync";
// height?: number | string;
// sizes?: string;
// src?: string;
// srcSet?: string;

export interface IZoom {

}

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  errorSrc?: string;
  srcSet?: string,
  alt?: string;
  style?: React.CSSProperties;
  prefixCls?: string;
  responsive?: boolean,
  className?: string;
  // 预览
  preview?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}
