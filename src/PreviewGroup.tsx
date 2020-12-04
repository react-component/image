import * as React from 'react';
import { useState } from 'react';
import Preview from './Preview';

export interface GroupConsumerProps {
  previewPrefixCls?: string;
}

export interface GroupConsumerValue extends GroupConsumerProps {
  isPreviewGroup?: boolean;
  previewUrls: string[];
  setPreviewUrls: React.Dispatch<React.SetStateAction<string[]>>;
  setCurrent: React.Dispatch<React.SetStateAction<string>>;
  setShowPreview: React.Dispatch<React.SetStateAction<boolean>>;
  setMousePosition: React.Dispatch<React.SetStateAction<null | { x: number; y: number }>>;
}

export const context = React.createContext<GroupConsumerValue>({
  previewUrls: [],
  setPreviewUrls: () => null,
  setCurrent: () => null,
  setShowPreview: () => null,
  setMousePosition: () => null,
});

const { Provider } = context;

const Group: React.FC<GroupConsumerProps> = ({
  previewPrefixCls = 'rc-image-preview',
  children,
}) => {
  const [previewUrls, setPreviewUrls] = useState([]);
  const [current, setCurrent] = useState();
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
        src={current}
      />
    </Provider>
  );
};

export default Group;
