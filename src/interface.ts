import * as React from 'react';

/**
 * Used for PreviewGroup passed image data
 */
export type ImageElementProps = Pick<
  React.ImgHTMLAttributes<HTMLImageElement>,
  | 'src'
  | 'crossOrigin'
  | 'decoding'
  | 'draggable'
  | 'loading'
  | 'referrerPolicy'
  | 'sizes'
  | 'srcSet'
  | 'useMap'
  | 'alt'
>;

export type PreviewImageElementProps = ImageElementProps & {
  canPreview: boolean;
};

export type RegisterImage = (id: number, data: PreviewImageElementProps) => VoidFunction;

export type OnGroupPreview = (id: number, mouseX: number, mouseY: number) => void;
