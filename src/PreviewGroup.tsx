import useMergedState from 'rc-util/lib/hooks/useMergedState';
import * as React from 'react';
import { useState } from 'react';
import { PreviewGroupContext } from './context';
import type { TransformType } from './hooks/useImageTransform';
import usePreviewItems from './hooks/usePreviewItems';
import type { ImagePreviewType } from './Image';
import type { ImageElementProps, OnGroupPreview } from './interface';
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
  onVisibleChange?: (value: boolean, prevValue: boolean, current: number) => void;
  onChange?: (current: number, prevCurrent: number) => void;
}

export interface GroupConsumerProps {
  previewPrefixCls?: string;
  icons?: PreviewProps['icons'];
  items?: (string | ImageElementProps)[];
  preview?: boolean | PreviewGroupPreview;
  children?: React.ReactNode;
}

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
    current: currentIndex,
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
  const [current, setCurrent] = useMergedState(0, {
    value: currentIndex,
  });

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
    (id, mouseX, mouseY) => {
      const index = mergedItems.findIndex(item => item.id === id);

      setShowPreview(true);
      setMousePosition({ x: mouseX, y: mouseY });
      setCurrent(
        // `items` should always open the first one
        // We easy replace `-1` to `0` here
        index < 0 ? 0 : index,
      );
    },
    [mergedItems],
  );

  // ========================== Events ==========================
  const onInternalChange: PreviewGroupPreview['onChange'] = (next, prev) => {
    setCurrent(next);

    onChange?.(next, prev);
  };

  const onPreviewClose = () => {
    setShowPreview(false);
    setMousePosition(null);
  };

  // if not controlled current, reset to first image when closed
  const afterClose = () => {
    if (currentIndex === undefined) {
      setCurrent(0);
    }
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
        current={current}
        count={mergedItems.length}
        countRender={countRender}
        onTransform={onTransform}
        toolbarRender={toolbarRender}
        imageRender={imageRender}
        onChange={onInternalChange}
        afterClose={afterClose}
        {...dialogProps}
      />
    </PreviewGroupContext.Provider>
  );
};

export default Group;
