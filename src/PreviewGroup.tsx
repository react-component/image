import useMergedState from 'rc-util/lib/hooks/useMergedState';
import * as React from 'react';
import { useState } from 'react';
import type { TransformType } from './hooks/useImageTransform';
import type { ImagePreviewType } from './Image';
import type { PreviewProps, ToolbarRenderType } from './Preview';
import Preview from './Preview';

export interface PreviewGroupPreview
  extends Omit<
    ImagePreviewType,
    'icons' | 'mask' | 'maskClassName' | 'onVisibleChange' | 'toolbarRender' | 'imageRender'
  > {
  /**
   * If Preview the show img index
   * @default 0
   */
  current?: number;
  countRender?: (current: number, total: number) => string;
  toolbarRender?: (params: ToolbarRenderType) => React.ReactNode;
  imageRender?: (params: {
    originalNode: React.ReactNode;
    transform: TransformType;
    current: number;
  }) => React.ReactNode;
  onVisibleChange?: (value: boolean, prevValue: boolean, currentIndex: number) => void;
  onChange?: (current: number, prevCurrent: number) => void;
}

export interface GroupConsumerProps {
  previewPrefixCls?: string;
  icons?: PreviewProps['icons'];
  preview?: boolean | PreviewGroupPreview;
  children?: React.ReactNode;
}

interface PreviewData {
  src: string;
  imgCommonProps: React.ImgHTMLAttributes<HTMLImageElement>;
  canPreview: boolean;
}

export interface GroupConsumerValue extends GroupConsumerProps {
  isPreviewGroup?: boolean;
  previewData: Map<number, PreviewData>;
  setPreviewData: React.Dispatch<React.SetStateAction<Map<number, PreviewData>>>;
  current: number;
  setCurrent: React.Dispatch<React.SetStateAction<number>>;
  setShowPreview: React.Dispatch<React.SetStateAction<boolean>>;
  setMousePosition: React.Dispatch<React.SetStateAction<null | { x: number; y: number }>>;
  registerImage: (id: number, data: PreviewData) => () => void;
  rootClassName?: string;
}

/* istanbul ignore next */
export const context = React.createContext<GroupConsumerValue>({
  previewData: new Map(),
  setPreviewData: () => null,
  current: null,
  setCurrent: () => null,
  setShowPreview: () => null,
  setMousePosition: () => null,
  registerImage: () => () => null,
  rootClassName: '',
});

const { Provider } = context;

function getSafeIndex(keys: number[], key: number) {
  if (key === undefined) return undefined;
  const index = keys.indexOf(key);
  if (index === -1) return undefined;
  return index;
}

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
    countRender = undefined,
    onChange = undefined,
    onTransform = undefined,
    toolbarRender = undefined,
    imageRender = undefined,
    ...dialogProps
  } = typeof preview === 'object' ? preview : {};
  const [previewData, setPreviewData] = useState<Map<number, PreviewData>>(new Map());
  const previewDataKeys = Array.from(previewData.keys());
  const prevCurrent = React.useRef<number | undefined>();
  const [current, setCurrent] = useMergedState<number>(undefined, {
    onChange: (val, prev) => {
      if (prevCurrent.current !== undefined) {
        onChange?.(getSafeIndex(previewDataKeys, val), getSafeIndex(previewDataKeys, prev));
      }
      prevCurrent.current = prev;
    },
  });
  const [isShowPreview, setShowPreview] = useMergedState(!!previewVisible, {
    value: previewVisible,
    onChange: (val, prevVal) => {
      onPreviewVisibleChange?.(val, prevVal, getSafeIndex(previewDataKeys, current));
      prevCurrent.current = val ? current : undefined;
    },
  });

  const [mousePosition, setMousePosition] = useState<null | { x: number; y: number }>(null);
  const isControlled = previewVisible !== undefined;

  const currentControlledKey = previewDataKeys[currentIndex];
  const canPreviewData = new Map<number, PreviewData>(
    Array.from(previewData).filter(([, { canPreview }]) => !!canPreview),
  );

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

  const onPreviewClose = () => {
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

  const canPreviewCurrentData = canPreviewData.get(current);

  return (
    <Provider
      value={{
        isPreviewGroup: true,
        previewData: canPreviewData,
        setPreviewData,
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
        imgCommonProps={canPreviewCurrentData?.imgCommonProps}
        src={canPreviewCurrentData?.src}
        icons={icons}
        getContainer={getContainer}
        countRender={countRender}
        onTransform={onTransform}
        toolbarRender={toolbarRender}
        imageRender={imageRender}
        {...dialogProps}
      />
    </Provider>
  );
};

export default Group;
