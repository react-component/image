import useMergedState from 'rc-util/lib/hooks/useMergedState';
import * as React from 'react';
import { useState } from 'react';
import type { ImgInfo, ImagePreviewType } from './Image';
import type { PreviewProps, ToolbarRenderInfoType } from './Preview';
import Preview from './Preview';
import { PreviewGroupContext } from './context';
import type { TransformType } from './hooks/useImageTransform';
import usePreviewItems from './hooks/usePreviewItems';
import type { ImageElementProps, OnGroupPreview } from './interface';

export interface PreviewGroupPreview
  extends Omit<
    ImagePreviewType,
    'mask' | 'maskClassName' | 'onVisibleChange' | 'toolbarRender' | 'imageRender'
  > {
  /**
   * If Preview the show img index
   * @default 0
   */
  current?: number;
  countRender?: (current: number, total: number) => React.ReactNode;
  toolbarRender?: (
    originalNode: React.ReactElement,
    info: ToolbarRenderInfoType,
  ) => React.ReactNode;
  imageRender?: (
    originalNode: React.ReactElement,
    info: { transform: TransformType; current: number; image: ImgInfo },
  ) => React.ReactNode;
  onVisibleChange?: (value: boolean, prevValue: boolean, current: number) => void;
  onChange?: (current: number, prevCurrent: number) => void;
}

export interface GroupConsumerProps {
  previewPrefixCls?: string;
  icons?: PreviewProps['icons'];
  items?: (string | ImageElementProps)[];
  fallback?: string;
  preview?: boolean | PreviewGroupPreview;
  children?: React.ReactNode;
}

const Group: React.FC<GroupConsumerProps> = ({
  previewPrefixCls = 'rc-image-preview',
  children,
  icons = {},
  items,
  preview,
  fallback,
}) => {
  const {
    visible: previewVisible,
    onVisibleChange,
    getContainer,
    current: currentIndex,
    movable,
    minScale,
    maxScale,
    countRender,
    closeIcon,
    onChange,
    onTransform,
    toolbarRender,
    imageRender,
    ...dialogProps
  } = typeof preview === 'object' ? preview : ({} as PreviewGroupPreview);

  // ========================== Items ===========================
  const [mergedItems, register, fromItems] = usePreviewItems(items);

  // ========================= Preview ==========================
  // >>> Index
  const [current, setCurrent] = useMergedState(0, {
    value: currentIndex,
  });

  const [keepOpenIndex, setKeepOpenIndex] = useState(false);

  // >>> Image
  const { src, ...imgCommonProps } = mergedItems[current]?.data || {};
  // >>> Visible
  const [isShowPreview, setShowPreview] = useMergedState(!!previewVisible, {
    value: previewVisible,
    onChange: (val, prevVal) => {
      onVisibleChange?.(val, prevVal, current);
    },
  });

  // >>> Position
  const [mousePosition, setMousePosition] = useState<null | { x: number; y: number }>(null);

  const onPreviewFromImage = React.useCallback<OnGroupPreview>(
    (id, imageSrc, mouseX, mouseY) => {
      const index = fromItems
        ? mergedItems.findIndex(item => item.data.src === imageSrc)
        : mergedItems.findIndex(item => item.id === id);

      setCurrent(index < 0 ? 0 : index);

      setShowPreview(true);
      setMousePosition({ x: mouseX, y: mouseY });

      setKeepOpenIndex(true);
    },
    [mergedItems, fromItems],
  );

  // Reset current when reopen
  React.useEffect(() => {
    if (isShowPreview) {
      if (!keepOpenIndex) {
        setCurrent(0);
      }
    } else {
      setKeepOpenIndex(false);
    }
  }, [isShowPreview]);

  // ========================== Events ==========================
  const onInternalChange: PreviewGroupPreview['onChange'] = (next, prev) => {
    setCurrent(next);

    onChange?.(next, prev);
  };

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
      {children}
      <Preview
        aria-hidden={!isShowPreview}
        movable={movable}
        visible={isShowPreview}
        prefixCls={previewPrefixCls}
        closeIcon={closeIcon}
        onClose={onPreviewClose}
        mousePosition={mousePosition}
        imgCommonProps={imgCommonProps}
        src={src}
        fallback={fallback}
        icons={icons}
        minScale={minScale}
        maxScale={maxScale}
        getContainer={getContainer}
        current={current}
        count={mergedItems.length}
        countRender={countRender}
        onTransform={onTransform}
        toolbarRender={toolbarRender}
        imageRender={imageRender}
        onChange={onInternalChange}
        {...dialogProps}
      />
    </PreviewGroupContext.Provider>
  );
};

export default Group;
