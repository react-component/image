import * as React from 'react';
import { useState } from 'react';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import type { ImagePreviewType } from './Image';
import type { PreviewProps } from './Preview';
import Preview from './Preview';

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

interface PreviewUrl {
  url: string;
  canPreview: boolean;
}

export interface GroupConsumerValue extends GroupConsumerProps {
  isPreviewGroup?: boolean;
  previewUrls: Map<number, string>;
  setPreviewUrls: React.Dispatch<React.SetStateAction<Map<number, PreviewUrl>>>;
  current: number;
  setCurrent: React.Dispatch<React.SetStateAction<number>>;
  setShowPreview: React.Dispatch<React.SetStateAction<boolean>>;
  setMousePosition: React.Dispatch<React.SetStateAction<null | { x: number; y: number }>>;
  registerImage: (id: number, url: string, canPreview?: boolean) => () => void;
  rootClassName?: string;
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
  rootClassName: '',
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
  const [previewUrls, setPreviewUrls] = useState<Map<number, PreviewUrl>>(new Map());
  const [current, setCurrent] = useState<number>();
  const [isShowPreview, setShowPreview] = useMergedState(!!previewVisible, {
    value: previewVisible,
    onChange: onPreviewVisibleChange,
  });
  const [mousePosition, setMousePosition] = useState<null | { x: number; y: number }>(null);
  const isControlled = previewVisible !== undefined;
  const previewUrlsKeys = Array.from(previewUrls.keys());
  const currentControlledKey = previewUrlsKeys[currentIndex];
  const canPreviewUrls = new Map<number, string>(
    Array.from(previewUrls)
      .filter(([, { canPreview }]) => !!canPreview)
      .map(([id, { url }]) => [id, url]),
  );

  const registerImage = (id: number, url: string, canPreview: boolean = true) => {
    const unRegister = () => {
      setPreviewUrls(oldPreviewUrls => {
        const clonePreviewUrls = new Map(oldPreviewUrls);
        const deleteResult = clonePreviewUrls.delete(id);
        return deleteResult ? clonePreviewUrls : oldPreviewUrls;
      });
    };

    setPreviewUrls(oldPreviewUrls => {
      return new Map(oldPreviewUrls).set(id, {
        url,
        canPreview,
      });
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
        previewUrls: canPreviewUrls,
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
        src={canPreviewUrls.get(current)}
        icons={icons}
        getContainer={getContainer}
        {...dialogProps}
      />
    </Provider>
  );
};

export default Group;
