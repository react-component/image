import useControlledState from '@rc-component/util/lib/hooks/useControlledState';
import useEvent from '@rc-component/util/lib/hooks/useEvent';
import * as React from 'react';
import { useState } from 'react';
import type { ImgInfo } from './Image';
import type { InternalPreviewConfig, PreviewProps, PreviewSemanticName } from './Preview';
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

export interface PreviewGroupProps {
  previewPrefixCls?: string;
  classNames?: {
    popup?: Partial<Record<PreviewSemanticName, string>>;
  };

  styles?: {
    popup?: Partial<Record<PreviewSemanticName, React.CSSProperties>>;
  };

  icons?: PreviewProps['icons'];
  items?: (string | ImageElementProps)[];
  fallback?: string;
  preview?: boolean | GroupPreviewConfig;
  children?: React.ReactNode;
}

const Group: React.FC<PreviewGroupProps> = ({
  previewPrefixCls = 'rc-image-preview',
  classNames,
  styles,
  children,
  icons = {},
  items,
  preview,
  fallback,
}) => {
  const {
    open: previewOpen,
    onOpenChange,
    current: currentIndex,
    onChange,
    ...restProps
  } = preview && typeof preview === 'object' ? preview : ({} as GroupPreviewConfig);

  // ========================== Items ===========================
  const [mergedItems, register, fromItems] = usePreviewItems(items);

  // ========================= Preview ==========================
  // >>> Index
  const [current, setCurrent] = useControlledState(0, currentIndex);

  const [keepOpenIndex, setKeepOpenIndex] = useState(false);

  // >>> Image
  const { src, ...imgCommonProps } = mergedItems[current]?.data || {};
  // >>> Visible
  const [isShowPreview, setShowPreview] = useControlledState(!!previewOpen, previewOpen);
  const triggerShowPreview = useEvent((next: boolean) => {
    setShowPreview(next);
    if (next !== isShowPreview) {
      onOpenChange?.(next, { current });
    }
  });

  // >>> Position
  const [mousePosition, setMousePosition] = useState<null | { x: number; y: number }>(null);

  const onPreviewFromImage = React.useCallback<OnGroupPreview>(
    (id, imageSrc, mouseX, mouseY) => {
      const index = fromItems
        ? mergedItems.findIndex(item => item.data.src === imageSrc)
        : mergedItems.findIndex(item => item.id === id);

      setCurrent(index < 0 ? 0 : index);

      triggerShowPreview(true);
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
    triggerShowPreview(false);
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
        open={isShowPreview}
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
        classNames={classNames?.popup}
        styles={styles?.popup}
      />
    </PreviewGroupContext.Provider>
  );
};

export default Group;
