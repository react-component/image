import { useState } from 'react';
import type { GroupConsumerValue, PreviewData } from '../PreviewGroup';

function usePreviewInfo({
  items,
  currentIndex,
}: Pick<GroupConsumerValue, 'items' | 'currentIndex'>) {
  const [previewData, setPreviewData] = useState<Map<number, PreviewData>>(new Map());

  const canPreviewData = new Map<number, PreviewData>(
    Array.from(previewData).filter(([, { canPreview }]) => canPreview),
  );

  const previewIds = Array.from(canPreviewData.keys());

  const getSrcAndImgCommonProps = () => {
    if (items) {
      const item = items[currentIndex];
      if (item && typeof item === 'object') {
        const {
          src,
          crossOrigin,
          decoding,
          draggable,
          loading,
          referrerPolicy,
          sizes,
          srcSet,
          useMap,
          alt,
        } = item;
        return {
          src,
          imgCommonProps: {
            crossOrigin,
            decoding,
            draggable,
            loading,
            referrerPolicy,
            sizes,
            srcSet,
            useMap,
            alt,
          },
        };
      } else {
        return { src: item as string };
      }
    } else {
      const currentPreviewData = canPreviewData.get(previewIds[currentIndex]);
      return {
        src: currentPreviewData?.src,
        imgCommonProps: currentPreviewData?.imgCommonProps,
      };
    }
  };

  const count = items ? items.length : canPreviewData.size;

  const { src, imgCommonProps } = getSrcAndImgCommonProps();

  const registerImage = (id: number, data: PreviewData) => {
    const unRegister = () => {
      setPreviewData(oldPreviewData => {
        const clonePreviewData = new Map(oldPreviewData);
        const deleteResult = clonePreviewData.delete(id);
        return deleteResult ? clonePreviewData : oldPreviewData;
      });
    };

    setPreviewData(oldPreviewData => {
      return new Map(oldPreviewData).set(id, data);
    });

    return unRegister;
  };

  const getStartPreviewIndex = (currentId: number) => (items ? 0 : previewIds.indexOf(currentId));

  return {
    count,
    src,
    imgCommonProps,
    setPreviewData,
    registerImage,
    getStartPreviewIndex,
  };
}

export default usePreviewInfo;
