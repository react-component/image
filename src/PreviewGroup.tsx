import * as React from 'react';
import { useState } from 'react';
import Preview from './Preview';

export interface GroupConsumerProps {
  previewPrefixCls?: string;
}

export interface GroupConsumerValue extends GroupConsumerProps {
  isPreviewGroup?: boolean;
  previewUrls: Map<number, string>;
  setPreviewUrls: React.Dispatch<React.SetStateAction<Map<number, string>>>;
  current: number;
  setCurrent: React.Dispatch<React.SetStateAction<number>>;
  setShowPreview: React.Dispatch<React.SetStateAction<boolean>>;
  setMousePosition: React.Dispatch<React.SetStateAction<null | { x: number; y: number }>>;
  registerImage: (id: number, url: string) => () => boolean;
}

export const context = React.createContext<GroupConsumerValue>({
  previewUrls: new Map(),
  setPreviewUrls: () => null,
  current: null,
  setCurrent: () => null,
  setShowPreview: () => null,
  setMousePosition: () => null,
  registerImage: null,
});

const { Provider } = context;

const Group: React.FC<GroupConsumerProps> = ({
  previewPrefixCls = 'rc-image-preview',
  children,
}) => {
  const [previewUrls, setPreviewUrls] = useState<Map<number, string>>(new Map());
  const [current, setCurrent] = useState<number>();
  const [isShowPreview, setShowPreview] = useState(false);
  const [mousePosition, setMousePosition] = useState<null | { x: number; y: number }>(null);

  // eslint-disable-next-line no-plusplus
  const registerImage = (id: number, url: string) => {
    setPreviewUrls(new Map(previewUrls.set(id, url)));

    return () => {
      const removeResult = previewUrls.delete(id);

      if (removeResult) {
        setPreviewUrls(new Map(previewUrls));
      }

      return removeResult;
    };
  };

  const onPreviewClose = (e: React.SyntheticEvent<Element>) => {
    e.stopPropagation();
    setShowPreview(false);
    setMousePosition(null);
  };

  return (
    <Provider
      value={{
        isPreviewGroup: true,
        previewUrls,
        setPreviewUrls,
        current,
        setCurrent,
        setShowPreview,
        setMousePosition,
        registerImage,
      }}
    >
      {children}
      <Preview
        aria-hidden={!isShowPreview}
        visible={isShowPreview}
        prefixCls={previewPrefixCls}
        onClose={onPreviewClose}
        mousePosition={mousePosition}
        src={previewUrls.get(current)}
      />
    </Provider>
  );
};

export default Group;
