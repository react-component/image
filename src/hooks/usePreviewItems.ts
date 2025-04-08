import * as React from 'react';
import type { PreviewGroupProps } from '../PreviewGroup';
import { COMMON_PROPS } from '../common';
import type {
  ImageElementProps,
  InternalItem,
  PreviewImageElementProps,
  RegisterImage,
} from '../interface';

export type Items = Omit<InternalItem, 'canPreview'>[];

/**
 * Merge props provided `items` or context collected images
 */
export default function usePreviewItems(
  items?: PreviewGroupProps['items'],
): [items: Items, registerImage: RegisterImage, fromItems: boolean] {
  // Context collection image data
  const [images, setImages] = React.useState<Record<number, PreviewImageElementProps>>({});

  const registerImage = React.useCallback<RegisterImage>((id, data) => {
    setImages(imgs => ({
      ...imgs,
      [id]: data,
    }));

    return () => {
      setImages(imgs => {
        const cloneImgs = { ...imgs };
        delete cloneImgs[id];
        return cloneImgs;
      });
    };
  }, []);

  // items
  const mergedItems = React.useMemo<Items>(() => {
    // use `items` first
    if (items) {
      return items.map(item => {
        if (typeof item === 'string') {
          return { data: { src: item } };
        }
        const data: ImageElementProps = {};
        Object.keys(item).forEach(key => {
          if (['src', ...COMMON_PROPS].includes(key)) {
            data[key] = item[key];
          }
        });
        return { data };
      });
    }

    // use registered images secondly
    return Object.keys(images).reduce((total: Items, id) => {
      const { canPreview, data } = images[id];
      if (canPreview) {
        total.push({ data, id });
      }
      return total;
    }, []);
  }, [items, images]);

  return [mergedItems, registerImage, !!items];
}
