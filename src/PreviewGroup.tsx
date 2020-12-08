import * as React from 'react';
import { useState } from 'react';
import Preview from './Preview';

export interface GroupConsumerProps {
  previewPrefixCls?: string;
}

export interface GroupConsumerValue extends GroupConsumerProps {
  isPreviewGroup?: boolean;
  previewUrls: Map<HTMLImageElement, string>;
  setPreviewUrls: React.Dispatch<React.SetStateAction<Map<HTMLImageElement, string>>>;
  current: HTMLImageElement;
  setCurrent: React.Dispatch<React.SetStateAction<HTMLImageElement>>;
  setShowPreview: React.Dispatch<React.SetStateAction<boolean>>;
  setMousePosition: React.Dispatch<React.SetStateAction<null | { x: number; y: number }>>;
}

export const context = React.createContext<GroupConsumerValue>({
  previewUrls: new Map(),
  setPreviewUrls: () => null,
  current: null,
  setCurrent: () => null,
  setShowPreview: () => null,
  setMousePosition: () => null,
});

const { Provider } = context;

const Group: React.FC<GroupConsumerProps> = ({
  previewPrefixCls = 'rc-image-preview',
  children,
}) => {
  const [previewUrls, setPreviewUrls] = useState<Map<HTMLImageElement, string>>(new Map());
  const [current, setCurrent] = useState<HTMLImageElement>();
  const [isShowPreview, setShowPreview] = useState(false);
  const [mousePosition, setMousePosition] = useState<null | { x: number; y: number }>(null);
  const onPreviewClose = (e: React.SyntheticEvent<HTMLDivElement>) => {
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
      }}
    >
      {children}
      <Preview
        ria-hidden={!isShowPreview}
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
