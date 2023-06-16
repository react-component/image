import * as React from 'react';
import type { PreviewImageElementProps, RegisterImage } from '../interface';
import type { GroupConsumerProps } from '../PreviewGroup';

export type Items = (PreviewImageElementProps & {
  id: number;
})[];

/**
 * Merge props provided `items` or context collected images
 */
export default function usePreviewItems(
  items?: GroupConsumerProps['items'],
): [items: Items, registerImage: RegisterImage] {
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
    if (items) {
      return items.map((item, index) => {
        const itemObj = typeof item === 'string' ? { src: item } : item;

        return {
          ...itemObj,
          id: index,
        };
      });
    }

    return Object.keys(images).map(id => ({
      ...images[id],
      id: Number(id),
    }));
  }, [images]);

  return [mergedItems, registerImage];
}
