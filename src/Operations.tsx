import Portal from '@rc-component/portal';
import classnames from 'classnames';
import CSSMotion from 'rc-motion';
import KeyCode from 'rc-util/lib/KeyCode';
import * as React from 'react';
import { useContext } from 'react';
import type { ImgInfo } from './Image';
import type { PreviewProps, ToolbarRenderInfoType } from './Preview';
import { PreviewGroupContext } from './context';
import type { TransformType } from './hooks/useImageTransform';

type ToolType = 'switchLeft' | 'switchRight' | 'flipY' | 'flipX' | 'rotateLeft' | 'rotateRight' | 'zoomOut' | 'zoomIn';

interface ToolItem {
  icon: React.ReactNode;
  type: ToolType;
  disabled?: boolean;
  onClick: () => void;
}

interface OperationsProps
  extends Pick<
    PreviewProps,
    | 'visible'
    | 'maskTransitionName'
    | 'getContainer'
    | 'prefixCls'
    | 'rootClassName'
    | 'icons'
    | 'countRender'
    | 'closeIcon'
    | 'onClose'
  > {
  showSwitch: boolean;
  showProgress: boolean;
  current: number;
  transform: TransformType;
  count: number;
  scale: number;
  minScale: number;
  maxScale: number;
  onSwitchLeft: () => void;
  onSwitchRight: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRotateRight: () => void;
  onRotateLeft: () => void;
  onFlipX: () => void;
  onFlipY: () => void;
  onReset: () => void;
  toolbarRender: (
    originalNode: React.ReactElement,
    info: ToolbarRenderInfoType | Omit<ToolbarRenderInfoType, 'current' | 'total'>,
  ) => React.ReactNode;
  zIndex?: number;
  image?: ImgInfo;
}

const Operations: React.FC<OperationsProps> = props => {
  const {
    visible,
    maskTransitionName,
    getContainer,
    prefixCls,
    rootClassName,
    icons,
    countRender,
    showSwitch,
    showProgress,
    current,
    transform,
    count,
    scale,
    minScale,
    maxScale,
    closeIcon,
    onSwitchLeft,
    onSwitchRight,
    onClose,
    onZoomIn,
    onZoomOut,
    onRotateRight,
    onRotateLeft,
    onFlipX,
    onFlipY,
    onReset,
    toolbarRender,
    zIndex,
    image,
  } = props;
  const groupContext = useContext(PreviewGroupContext);
  const { rotateLeft, rotateRight, zoomIn, zoomOut, close, left, right, flipX, flipY } = icons;
  const toolClassName = `${prefixCls}-operations-operation`;

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.keyCode === KeyCode.ESC) {
        onClose();
      }
    };

    if (visible) {
      window.addEventListener('keydown', onKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [visible]);

  const basicTools: ToolItem[] = [
    {
      icon: flipY,
      onClick: onFlipY,
      type: 'flipY',
    },
    {
      icon: flipX,
      onClick: onFlipX,
      type: 'flipX',
    },
    {
      icon: rotateLeft,
      onClick: onRotateLeft,
      type: 'rotateLeft',
    },
    {
      icon: rotateRight,
      onClick: onRotateRight,
      type: 'rotateRight',
    },
    {
      icon: zoomOut,
      onClick: onZoomOut,
      type: 'zoomOut',
      disabled: scale <= minScale,
    },
    {
      icon: zoomIn,
      onClick: onZoomIn,
      type: 'zoomIn',
      disabled: scale === maxScale,
    },
  ]

  const groupTools: ToolItem[] = [
    {
      icon: left,
      onClick: onSwitchLeft,
      type: 'switchLeft',
      disabled: current === 0,
    },
    {
      icon: right,
      onClick: onSwitchRight,
      type: 'switchRight',
      disabled: current === count - 1,
    },
  ];

  const tools = showSwitch ? [...groupTools, ...basicTools] : basicTools;

  const toolsNodeMap = new Map<ToolType, React.ReactNode>()

  const toolsNode = tools.map(({ icon, onClick, type, disabled }) => {
    const element = (
      <div
        className={classnames(toolClassName, {
          [`${prefixCls}-operations-operation-${type}`]: true,
          [`${prefixCls}-operations-operation-disabled`]: !!disabled,
        })}
        onClick={onClick}
        key={type}
      >
        {icon}
      </div>
    );

    toolsNodeMap.set(type, element)

    return element;
  });

  const toolbarNode = <div className={`${prefixCls}-operations`}>{toolsNode}</div>;

  return (
    <CSSMotion visible={visible} motionName={maskTransitionName}>
      {({ className, style }) => (
        <Portal open getContainer={getContainer ?? document.body}>
          <div
            className={classnames(`${prefixCls}-operations-wrapper`, className, rootClassName)}
            style={{
              ...style,
              zIndex,
            }}
          >
            {closeIcon === null ? null : (
              <button className={`${prefixCls}-close`} onClick={onClose}>
                {closeIcon || close}
              </button>
            )}

            {showSwitch && (
              <>
                <div
                  className={classnames(`${prefixCls}-switch-left`, {
                    [`${prefixCls}-switch-left-disabled`]: current === 0,
                  })}
                  onClick={onSwitchLeft}
                >
                  {left}
                </div>
                <div
                  className={classnames(`${prefixCls}-switch-right`, {
                    [`${prefixCls}-switch-right-disabled`]: current === count - 1,
                  })}
                  onClick={onSwitchRight}
                >
                  {right}
                </div>
              </>
            )}

            <div className={`${prefixCls}-footer`}>
              {showProgress && (
                <div className={`${prefixCls}-progress`}>
                  {countRender ? countRender(current + 1, count) : `${current + 1} / ${count}`}
                </div>
              )}

              {toolbarRender
                ? toolbarRender(toolbarNode, {
                  icons: {
                    switchLeftIcon: toolsNodeMap.get('switchLeft'),
                    switchRightIcon: toolsNodeMap.get('switchRight'),
                    flipYIcon: toolsNodeMap.get('flipY'),
                    flipXIcon: toolsNodeMap.get('flipX'),
                    rotateLeftIcon: toolsNodeMap.get('rotateLeft'),
                    rotateRightIcon: toolsNodeMap.get('rotateRight'),
                    zoomOutIcon: toolsNodeMap.get('zoomOut'),
                    zoomInIcon: toolsNodeMap.get('zoomIn'),
                  },
                  actions: {
                    onSwitchLeft,
                    onSwitchRight,
                    onFlipY,
                    onFlipX,
                    onRotateLeft,
                    onRotateRight,
                    onZoomOut,
                    onZoomIn,
                    onReset,
                    onClose
                  },
                  transform,
                  ...(groupContext ? { current, total: count } : {}),
                  image,
                })
                : toolbarNode}
            </div>
          </div>
        </Portal>
      )}
    </CSSMotion>
  );
};

export default Operations;
