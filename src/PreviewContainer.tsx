// import ContainerRender from 'rc-util/lib/ContainerRender';
import Portal from 'rc-util/lib/Portal';
import * as React from 'react';
import { createPortal, findDOMNode } from 'react-dom';

import { IPreviewContainerProps } from './PropTypes';

const IS_REACT_16 = !!createPortal;

export default class PreviewContainer extends React.Component<IPreviewContainerProps, {}> {
  public static defaultProps = {
    style: {},
  }
  public getContainer = () => {
    const { style, getPreviewContainer } = this.props;
    const previewContainer: HTMLElement = document.createElement('div');
    if (style) {
      previewContainer.style.position = style.position || 'relative';
      previewContainer.style.zIndex = (style.zIndex as string) || '999';
      previewContainer.style.top = (style.top as string) || '0px';
      previewContainer.style.left = (style.left as string) || '0px'
    }


    const mountNode: HTMLElement = getPreviewContainer ?
      getPreviewContainer((findDOMNode(this) as HTMLElement)) :
      document.body;
    mountNode.appendChild(previewContainer);
    return previewContainer;
  }
  public render() {
    const { children  } = this.props;
    if (IS_REACT_16) {
      return (
        <Portal
          key="portal"
          getContainer={this.getContainer}
        >
          {children}
        </Portal>
      )
    }
    return (
      <div>{children}</div>
    )

    // return (

    // )
  }
}
