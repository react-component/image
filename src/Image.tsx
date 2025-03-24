import useMergedState from '@rc-component/util/lib/hooks/useMergedState';
import classnames from 'classnames';
import * as React from 'react';
import { useContext, useMemo, useState, forwardRef, useImperativeHandle, useRef } from 'react';
import type {
  InternalPreviewConfig,
  InternalPreviewSemanticName,
  ToolbarRenderInfoType,
} from './Preview';
import Preview from './Preview';
import PreviewGroup from './PreviewGroup';
import { COMMON_PROPS } from './common';
import { PreviewGroupContext } from './context';
import type { TransformType } from './hooks/useImageTransform';
import useRegisterImage from './hooks/useRegisterImage';
import useStatus from './hooks/useStatus';
import type { ImageElementProps } from './interface';

export interface ImgInfo {
  url: string;
  alt: string;
  width: string | number;
  height: string | number;
}

export interface PreviewConfig extends Omit<InternalPreviewConfig, 'countRender'> {
  cover?: React.ReactNode;
  classNames?: Partial<Record<PreviewSemanticName, string>>;
  styles?: Partial<Record<PreviewSemanticName, React.CSSProperties>>;

  // Similar to InternalPreviewConfig but not have `current`
  imageRender?: (
    originalNode: React.ReactElement,
    info: { transform: TransformType; image: ImgInfo },
  ) => React.ReactNode;

  // Similar to InternalPreviewConfig but not have `current` and `total`
  actionsRender?: (
    originalNode: React.ReactElement,
    info: Omit<ToolbarRenderInfoType, 'current' | 'total'>,
  ) => React.ReactNode;

  onOpenChange?: (open: boolean) => void;
}

export type SemanticName = 'root' | 'image';

export type PreviewSemanticName = InternalPreviewSemanticName | 'cover';

export interface ImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'placeholder' | 'onClick'> {
  // Misc
  prefixCls?: string;
  previewPrefixCls?: string;

  // Styles
  rootClassName?: string;
  classNames?: Partial<Record<SemanticName, string>>;
  styles?: Partial<Record<SemanticName, React.CSSProperties>>;

  // Image
  src?: string;
  placeholder?: React.ReactNode;
  fallback?: string;

  // Preview
  preview?: boolean | PreviewConfig;

  // Events
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

// 定义 ImageRef 接口，只包含 nativeElement 属性
export interface ImageRef {
  nativeElement: HTMLImageElement | null;
}

interface CompoundedComponent<P> extends React.ForwardRefExoticComponent<P & React.RefAttributes<ImageRef>> {
  PreviewGroup: typeof PreviewGroup;
}

const ImageInternal = forwardRef<ImageRef, ImageProps>((props, ref) => {
  const {
    // Misc
    prefixCls = 'rc-image',
    previewPrefixCls = `${prefixCls}-preview`,

    // Style
    rootClassName,
    className,
    style,

    classNames = {},
    styles = {},

    width,
    height,

    // Image
    src: imgSrc,
    alt,
    placeholder,
    fallback,

    // Preview
    preview = true,

    // Events
    onClick,
    onError,
    ...otherProps
  } = props;

  // 创建内部引用来跟踪 image 元素
  const imageElementRef = useRef<HTMLImageElement | null>(null);

  // 使用 useImperativeHandle 暴露自定义 ref 对象
  useImperativeHandle(ref, () => ({
    nativeElement: imageElementRef.current,
  }));
  const groupContext = useContext(PreviewGroupContext);

  // ========================== Preview ===========================
  const canPreview = !!preview;

  const {
    src: previewSrc,
    open: previewOpen,
    onOpenChange: onPreviewOpenChange,
    cover,
    classNames: previewClassNames = {},
    styles: previewStyles = {},
    rootClassName: previewRootClassName,
    ...restProps
  }: PreviewConfig = preview && typeof preview === 'object' ? preview : {};

  // ============================ Open ============================
  const [isShowPreview, setShowPreview] = useMergedState(!!previewOpen, {
    value: previewOpen,
  });

  const [mousePosition, setMousePosition] = useState<null | { x: number; y: number }>(null);

  const triggerPreviewOpen = (nextOpen: boolean) => {
    setShowPreview(nextOpen);
    onPreviewOpenChange?.(nextOpen);
  };

  const onPreviewClose = () => {
    triggerPreviewOpen(false);
  };

  // ========================= ImageProps =========================
  const isCustomPlaceholder = placeholder && placeholder !== true;

  const src = previewSrc ?? imgSrc;
  const [getImgRef, srcAndOnload, status] = useStatus({
    src: imgSrc,
    isCustomPlaceholder,
    fallback,
  });

  const imgCommonProps = useMemo(
    () => {
      const obj: ImageElementProps = {};
      COMMON_PROPS.forEach((prop: any) => {
        if (props[prop] !== undefined) {
          obj[prop] = props[prop];
        }
      });

      return obj;
    },
    COMMON_PROPS.map(prop => props[prop]),
  );

  // ========================== Register ==========================
  const registerData: ImageElementProps = useMemo(
    () => ({
      ...imgCommonProps,
      src,
    }),
    [src, imgCommonProps],
  );

  const imageId = useRegisterImage(canPreview, registerData);

  // ========================== Preview ===========================
  const onPreview: React.MouseEventHandler<HTMLDivElement> = e => {
    const rect = (e.target as HTMLDivElement).getBoundingClientRect();
    const left = rect.x + rect.width / 2;
    const top = rect.y + rect.height / 2;

    if (groupContext) {
      groupContext.onPreview(imageId, src, left, top);
    } else {
      setMousePosition({
        x: left,
        y: top,
      });
      triggerPreviewOpen(true);
    }

    onClick?.(e);
  };

  // ========================== Image Ref ==========================
  const handleRef = (img: HTMLImageElement | null) => {
    if (!img) {
      return;
    }
    // 保存到内部引用
    imageElementRef.current = img;
    getImgRef(img);
  };

  // =========================== Render ===========================
  return (
    <>
      <div
        {...otherProps}
        className={classnames(prefixCls, rootClassName, classNames.root, {
          [`${prefixCls}-error`]: status === 'error',
        })}
        onClick={canPreview ? onPreview : onClick}
        style={{
          width,
          height,
          ...styles.root,
        }}
      >
        <img
          {...imgCommonProps}
          className={classnames(
            `${prefixCls}-img`,
            {
              [`${prefixCls}-img-placeholder`]: placeholder === true,
            },
            classNames.image,
            className,
          )}
          style={{
            height,
            ...styles.image,
            ...style,
          }}
          ref={handleRef}
          {...srcAndOnload}
          width={width}
          height={height}
          onError={onError}
        />

        {status === 'loading' && (
          <div aria-hidden="true" className={`${prefixCls}-placeholder`}>
            {placeholder}
          </div>
        )}

        {/* Preview Click Mask */}
        {cover !== false && canPreview && (
          <div
            className={classnames(`${prefixCls}-cover`, previewClassNames.cover)}
            style={{
              display: style?.display === 'none' ? 'none' : undefined,
              ...previewStyles.cover,
            }}
          >
            {cover}
          </div>
        )}
      </div>
      {!groupContext && canPreview && (
        <Preview
          aria-hidden={!isShowPreview}
          open={isShowPreview}
          prefixCls={previewPrefixCls}
          onClose={onPreviewClose}
          mousePosition={mousePosition}
          src={src}
          alt={alt}
          imageInfo={{ width, height }}
          fallback={fallback}
          imgCommonProps={imgCommonProps}
          classNames={previewClassNames}
          styles={previewStyles}
          rootClassName={classnames(previewRootClassName, rootClassName)}
          {...restProps}
        />
      )}
    </>
  );
}) as CompoundedComponent<ImageProps>;
ImageInternal.PreviewGroup = PreviewGroup;

if (process.env.NODE_ENV !== 'production') {
  ImageInternal.displayName = 'Image';
}

export default ImageInternal;