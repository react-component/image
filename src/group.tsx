import * as React from 'react';
import context, { GroupConsumerProps } from './context';
import Preview from './Preview';

const { Provider } = context;

const Group: React.FC<GroupConsumerProps> = ({
  mergedPreview = true,
  prefixCls = 'rc-image',
  previewPrefixCls = `${prefixCls}-preview`,
  children,
}) => {
  const [previewUrls, setPreviewUrls] = React.useState([]);
  const [current, setCurrent] = React.useState();
  const [isShowPreview, setShowPreview] = React.useState(false);
  const [mousePosition, setMousePosition] = React.useState<null | { x: number; y: number }>(null);
  const onPreviewClose = (e: React.SyntheticEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setShowPreview(false);
    setMousePosition(null);
  };
  return (
    <Provider
      value={{
        mergedPreview,
        previewUrls,
        setPreviewUrls,
        setCurrent,
        setShowPreview,
        setMousePosition,
      }}
    >
      {children}
      {mergedPreview && (
        <Preview
          ria-hidden={!isShowPreview}
          visible={isShowPreview}
          onClose={onPreviewClose}
          prefixCls={previewPrefixCls}
          mousePosition={mousePosition}
          src={current}
        />
      )}
    </Provider>
  );
};

export default Group;
