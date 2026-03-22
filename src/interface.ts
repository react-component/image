export type FetchPriority = 'high' | 'low' | 'auto';

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
> & {
  fetchpriority?: FetchPriority;
};

export type PreviewImageElementProps = {
  data: ImageElementProps;
  canPreview: boolean;
};

export type InternalItem = PreviewImageElementProps & {
  id?: string;
};

export type RegisterImage = (id: string, data: PreviewImageElementProps) => VoidFunction;

export type OnGroupPreview = (id: string, imageSrc: string, mouseX: number, mouseY: number) => void;
