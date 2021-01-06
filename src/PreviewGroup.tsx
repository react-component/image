import * as React from 'react';
import { useState } from 'react';
import Preview, { PreviewProps } from './Preview';

export interface GroupConsumerProps {
  previewPrefixCls?: string;
  icons?: PreviewProps['icons'];
}

export interface GroupConsumerValue extends GroupConsumerProps {
  isPreviewGroup?: boolean;
  previewUrls: Map<number, string>;
  setPreviewUrls: React.Dispatch<React.SetStateAction<Map<number, string>>>;
  current: number;
  setCurrent: React.Dispatch<React.SetStateAction<number>>;
  setShowPreview: React.Dispatch<React.SetStateAction<boolean>>;
  setMousePosition: React.Dispatch<React.SetStateAction<null | { x: number; y: number }>>;
  registerImage: (id: number, url: string) => () => void;
}

/* istanbul ignore next */
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
  icons = {},
}) => {
  const [previewUrls, setPreviewUrls] = useState<Map<number, string>>(new Map());
  const [current, setCurrent] = useState<number>();
  const [isShowPreview, setShowPreview] = useState(false);
  const [mousePosition, setMousePosition] = useState<null | { x: number; y: number }>(null);

  const registerImage = (id: number, url: string) => {
    setPreviewUrls(oldPreviewUrls => {
      return new Map(oldPreviewUrls).set(id, url);
    });

    return () => {
      setPreviewUrls(oldPreviewUrls => {
        const clonePreviewUrls = new Map(oldPreviewUrls);
        const deleteResult = clonePreviewUrls.delete(id);
        return deleteResult ? clonePreviewUrls : oldPreviewUrls;
      });
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
        icons={icons}
      />
    </Provider>
  );
};

export default Group;
