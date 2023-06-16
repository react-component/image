import useMergedState from 'rc-util/lib/hooks/useMergedState';
import omit from 'rc-util/lib/omit';
import * as React from 'react';
import { useState } from 'react';
import { PreviewGroupContext } from './hooks/context';
import type { TransformType } from './hooks/useImageTransform';
import usePreviewItems from './hooks/usePreviewItems';
import type { ImagePreviewType } from './Image';
import { ImageElementProps, InternalItem, OnGroupPreview } from './interface';
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
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  setShowPreview: React.Dispatch<React.SetStateAction<boolean>>;
  setMousePosition: React.Dispatch<React.SetStateAction<null | { x: number; y: number }>>;
  rootClassName?: string;
}

/* istanbul ignore next */
export const context = React.createContext<GroupConsumerValue>({
  currentIndex: null,
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

  // >>> Image
  const imgCommonProps = omit(mergedItems[currentIndex] || ({} as InternalItem), [
    'id',
    'canPreview',
  ]);
  const src = imgCommonProps.src;

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
      const index = mergedItems.findIndex(item => item.id === id);

      setShowPreview(true);
      setMousePosition({ x: mouseX, y: mouseY });
      setCurrentIndex(
        // `items` should always open the first one
        // We easy replace `-1` to `0` here
        index < 0 ? 0 : index,
      );
    },
    [mergedItems],
  );

  // ========================== Legacy ==========================

  const onPreviewClose = () => {
    setShowPreview(false);
    setMousePosition(null);
  };

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
