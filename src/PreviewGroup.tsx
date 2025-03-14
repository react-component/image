import useMergedState from '@rc-component/util/lib/hooks/useMergedState';
import * as React from 'react';
import { useState } from 'react';
import type { ImgInfo } from './Image';
import type { InternalPreviewConfig, PreviewProps } from './Preview';
import Preview from './Preview';
import { PreviewGroupContext } from './context';
import type { TransformType } from './hooks/useImageTransform';
import usePreviewItems from './hooks/usePreviewItems';
import type { ImageElementProps, OnGroupPreview } from './interface';

export interface GroupPreviewConfig extends InternalPreviewConfig {
  current?: number;
  // Similar to InternalPreviewConfig but has additional current
  imageRender?: (
    originalNode: React.ReactElement,
    info: { transform: TransformType; current: number; image: ImgInfo },
  ) => React.ReactNode;
  onOpenChange?: (value: boolean, info: { current: number }) => void;
  onChange?: (current: number, prevCurrent: number) => void;
}

export interface GroupConsumerProps {
  previewPrefixCls?: string;
  icons?: PreviewProps['icons'];
  items?: (string | ImageElementProps)[];
  fallback?: string;
  preview?: boolean | GroupPreviewConfig;
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
    onOpenChange,
    current: currentIndex,
    onChange,
    ...restProps
  } = preview && typeof preview === 'object' ? preview : ({} as GroupPreviewConfig);

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
    onChange: val => {
      onOpenChange?.(val, { current });
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
  const onInternalChange: GroupPreviewConfig['onChange'] = (next, prev) => {
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
        visible={isShowPreview}
        prefixCls={previewPrefixCls}
        onClose={onPreviewClose}
        mousePosition={mousePosition}
        imgCommonProps={imgCommonProps}
        src={src}
        fallback={fallback}
        icons={icons}
        current={current}
        count={mergedItems.length}
        onChange={onInternalChange}
        {...restProps}
      />
    </PreviewGroupContext.Provider>
  );
};

export default Group;
