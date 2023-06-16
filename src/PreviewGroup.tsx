import useMergedState from 'rc-util/lib/hooks/useMergedState';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { PreviewGroupContext } from './hooks/context';
import type { TransformType } from './hooks/useImageTransform';
import usePreviewInfo from './hooks/usePreviewInfo';
import usePreviewItems from './hooks/usePreviewItems';
import type { ImagePreviewType } from './Image';
import { ImageElementProps, OnGroupPreview } from './interface';
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
  items?: (string | ImageElementProps)[];
  preview?: boolean | PreviewGroupPreview;
  children?: React.ReactNode;
}

export interface PreviewData {
  src: string;
  imgCommonProps?: React.ImgHTMLAttributes<HTMLImageElement>;
  canPreview?: boolean;
}

export interface GroupConsumerValue extends GroupConsumerProps {
  isPreviewGroup?: boolean;
  currentIndex: number;
  getStartPreviewIndex: (currentId: number) => number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  setShowPreview: React.Dispatch<React.SetStateAction<boolean>>;
  setMousePosition: React.Dispatch<React.SetStateAction<null | { x: number; y: number }>>;
  rootClassName?: string;
}

/* istanbul ignore next */
export const context = React.createContext<GroupConsumerValue>({
  currentIndex: null,
  getStartPreviewIndex: () => null,
  setCurrentIndex: () => null,
  setShowPreview: () => null,
  setMousePosition: () => null,
  rootClassName: '',
});

const { Provider } = context;

const Group: React.FC<GroupConsumerProps> = ({
  previewPrefixCls = 'rc-image-preview',
  children,
  icons = {},
  items,
  preview,
}) => {
  const {
    visible: previewVisible,
    onVisibleChange,
    getContainer,
    current,
    minScale,
    maxScale,
    countRender,
    onChange,
    onTransform,
    toolbarRender,
    imageRender,
    ...dialogProps
  } = typeof preview === 'object' ? preview : ({} as PreviewGroupPreview);

  // ========================== Items ===========================
  const [mergedItems, register] = usePreviewItems(items);

  // ========================= Preview ==========================
  // >>> Index
  const [currentIndex, setCurrentIndex] = useMergedState(0, {
    value: current,
  });
  const src = mergedItems[currentIndex]?.src;

  // >>> Visible
  const [isShowPreview, setShowPreview] = useMergedState(!!previewVisible, {
    value: previewVisible,
    onChange: (val, prevVal) => {
      onVisibleChange?.(val, prevVal, currentIndex);
    },
  });

  // >>> Position
  const [mousePosition, setMousePosition] = useState<null | { x: number; y: number }>(null);

  const onPreviewFromImage = React.useCallback<OnGroupPreview>(
    (id, mouseX, mouseY) => {
      setShowPreview(true);
      setMousePosition({ x: mouseX, y: mouseY });
      setCurrentIndex(mergedItems.findIndex(item => item.id === id));
    },
    [mergedItems],
  );

  // ========================== Legacy ==========================

  const { imgCommonProps, registerImage, getStartPreviewIndex } = usePreviewInfo({
    items,
    currentIndex,
  });

  const onPreviewClose = () => {
    setShowPreview(false);
    setMousePosition(null);
  };

  const isControlledCurrent = current !== undefined;

  // is not controlled current and closed
  useEffect(() => {
    if (!isControlledCurrent && !isShowPreview) {
      setCurrentIndex(0);
    }
  }, [isShowPreview, isControlledCurrent]);

  // ========================= Context ==========================
  const previewGroupContext = React.useMemo(
    () => ({ register, onPreview: onPreviewFromImage }),
    [register, onPreviewFromImage],
  );

  // ========================== Render ==========================
  return (
    <PreviewGroupContext.Provider value={previewGroupContext}>
      <Provider
        value={{
          isPreviewGroup: true,
          currentIndex,
          setShowPreview,
          setMousePosition,
          setCurrentIndex,
          getStartPreviewIndex,
        }}
      >
        {children}
        <Preview
          aria-hidden={!isShowPreview}
          visible={isShowPreview}
          prefixCls={previewPrefixCls}
          onClose={onPreviewClose}
          mousePosition={mousePosition}
          imgCommonProps={imgCommonProps}
          src={src}
          icons={icons}
          minScale={minScale}
          maxScale={maxScale}
          getContainer={getContainer}
          count={mergedItems.length}
          countRender={countRender}
          onTransform={onTransform}
          toolbarRender={toolbarRender}
          imageRender={imageRender}
          onChange={onChange}
          {...dialogProps}
        />
      </Provider>
    </PreviewGroupContext.Provider>
  );
};

export default Group;
