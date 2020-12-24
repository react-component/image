import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Preview, { PreviewProps } from './Preview';

export interface PreviewerOptions
  extends Omit<PreviewProps, 'isSelfControl' | 'src' | 'getContainer'> {}

function previewer(url: string, options: PreviewerOptions = {}): void {
  const { prefixCls = 'rc-image-preview', onAfterClose: onInternalAfterClose } = options;
  const div = document.createElement('div');

  document.body.appendChild(div);

  const onAfterClose = () => {
    const unMountResult = ReactDOM.unmountComponentAtNode(div);

    if (unMountResult) {
      div.parentNode?.removeChild(div);
    }

    onInternalAfterClose?.();
  };

  const render = () => {
    return ReactDOM.render(
      <Preview
        {...options}
        aria-hidden="false"
        src={url}
        prefixCls={prefixCls}
        onAfterClose={onAfterClose}
        isSelfControl
        getContainer={div}
      />,
      div,
    );
  };

  render();
}

export default previewer;
