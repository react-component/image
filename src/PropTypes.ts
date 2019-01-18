
import * as PropTypes from 'prop-types';
import {
  CSSProperties,
  ReactNode,
} from 'react';

// crossOrigin?: "anonymous" | "use-credentials" | "";
// decoding?: "async" | "auto" | "sync";
// height?: number | string;
// sizes?: string;
// src?: string;
// srcSet?: string;

export interface IImageProps {
  id: string;
  src: string;
  errorSrc?: string;
  srcSet: string,
  alt: string;
  children: JSX.Element[] | JSX.Element | any;
  style: CSSProperties;
  wrapperStyle: CSSProperties;
  prefixCls: string;
  responsive: boolean,
  disabled: boolean,
  className: string;
  placeholder: JSX.Element | string;
  onLoad: () => void;
  onError: () => void;
}
