import useMergedState from '@rc-component/util/lib/hooks/useMergedState';
import classnames from 'classnames';
import * as React from 'react';
import { useContext, useMemo, useState } from 'react';
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

  onVisibleChange?: (visible: boolean, prevVisible: boolean) => void;
}

export type SemanticName = 'root' | 'image';

export type PreviewSemanticName = InternalPreviewSemanticName | 'cover';

export interface ImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'placeholder' | 'onClick'> {
  // Misc
  prefixCls?: string;
  previewPrefixCls?: string;

  // Styles
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

interface CompoundedComponent<P> extends React.FC<P> {
  PreviewGroup: typeof PreviewGroup;
}

const ImageInternal: CompoundedComponent<ImageProps> = props => {
  const {
    // Misc
    prefixCls = 'rc-image',
    previewPrefixCls = `${prefixCls}-preview`,

    // Style
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

  const groupContext = useContext(PreviewGroupContext);

  // ========================== Preview ===========================
  const canPreview = !!preview;

  const {
    src: previewSrc,
    visible: previewVisible = undefined,
    onVisibleChange: onPreviewVisibleChange,
    cover,
    classNames: previewClassNames = {},
    styles: previewStyles = {},
    ...restProps
  }: PreviewConfig = preview && typeof preview === 'object' ? preview : {};

  // ============================ Open ============================
  const [isShowPreview, setShowPreview] = useMergedState(!!previewVisible, {
    value: previewVisible,
    onChange: onPreviewVisibleChange,
  });

  const [mousePosition, setMousePosition] = useState<null | { x: number; y: number }>(null);

  const onPreviewClose = () => {
    setShowPreview(false);
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
      setShowPreview(true);
    }

    onClick?.(e);
  };

  // =========================== Render ===========================
  return (
    <>
      <div
        {...otherProps}
        className={classnames(prefixCls, classNames.root, {
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
          ref={getImgRef}
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
          visible={isShowPreview}
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
          {...restProps}
        />
      )}
    </>
  );
};

ImageInternal.PreviewGroup = PreviewGroup;

if (process.env.NODE_ENV !== 'production') {
  ImageInternal.displayName = 'Image';
}

export default ImageInternal;
