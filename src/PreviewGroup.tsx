import * as React from 'react';
import { useState } from 'react';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import { ImagePreviewType } from './Image';
import Preview, { PreviewProps } from './Preview';

export interface PreviewGroupPreview
  extends Omit<ImagePreviewType, 'icons' | 'mask' | 'maskClassName'> {
  /**
   * If Preview the show img index
   * @default 0
   */
  current?: number;
}

export interface GroupConsumerProps {
  previewPrefixCls?: string;
  icons?: PreviewProps['icons'];
  preview?: boolean | PreviewGroupPreview;
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
  registerImage: () => () => null,
});

const { Provider } = context;

const Group: React.FC<GroupConsumerProps> = ({
  previewPrefixCls = 'rc-image-preview',
  children,
  icons = {},
  preview,
}) => {
  const {
    visible: previewVisible = undefined,
    onVisibleChange: onPreviewVisibleChange = undefined,
    getContainer = undefined,
    current: currentIndex = 0,
    ...dialogProps
  } = typeof preview === 'object' ? preview : {};
  const [previewUrls, setPreviewUrls] = useState<Map<number, string>>(new Map());
  const [current, setCurrent] = useState<number>();
  const [isShowPreview, setShowPreview] = useMergedState(!!previewVisible, {
    value: previewVisible,
    onChange: onPreviewVisibleChange,
  });
  const [mousePosition, setMousePosition] = useState<null | { x: number; y: number }>(null);
  const isControlled = previewVisible !== undefined;
  const previewUrlsKeys = Array.from(previewUrls.keys());
  const currentControlledKey = previewUrlsKeys[currentIndex];

  const registerImage = (id: number, url: string) => {
    const unRegister = () => {
      setPreviewUrls(oldPreviewUrls => {
        const clonePreviewUrls = new Map(oldPreviewUrls);
        const deleteResult = clonePreviewUrls.delete(id);
        return deleteResult ? clonePreviewUrls : oldPreviewUrls;
      });
    };

    // we don't need to test this if canPreview changed when url stays the same
    /* istanbul ignore next */
    if (previewUrls.get(id) === url) {
      return unRegister;
    }

    setPreviewUrls(oldPreviewUrls => {
      return new Map(oldPreviewUrls).set(id, url);
    });

    return unRegister;
  };

  const onPreviewClose = (e: React.SyntheticEvent<Element>) => {
    e.stopPropagation();
    setShowPreview(false);
    setMousePosition(null);
  };

  React.useEffect(() => {
    setCurrent(currentControlledKey);
  }, [currentControlledKey]);

  React.useEffect(() => {
    if (!isShowPreview && isControlled) {
      setCurrent(currentControlledKey);
    }
  }, [currentControlledKey, isControlled, isShowPreview]);

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
        getContainer={getContainer}
        {...dialogProps}
      />
    </Provider>
  );
};

export default Group;
