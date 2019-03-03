import cls from 'classnames';
import Dialog from 'rc-dialog';
import 'rc-dialog/assets/index.css';
import * as React from 'react';
import { polyfill } from 'react-lifecycles-compat';

interface IPreviewState {
  size: {
    width: number;
    height: number;
  };
}

export interface IPreviewProps {
  prefixCls?: string;
  src?: string;
  alt?: string;
  visible?: boolean;
  onClose?: (e: React.SyntheticEvent) => void;
  mousePosition: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
}

class Preview extends React.Component<IPreviewProps, IPreviewState> {
  constructor(props: IPreviewProps) {
    super(props);
    const { size } = this.props;
    console.log('---1111111-----', size);
    this.state = {
      size,
    };
  }
  public componentWillReceiveProps(prevProps, nextState) {
    this.setState({
      size: prevProps.size,
    });
  }
  public render() {
    const {
      prefixCls,
      src,
      alt,
      visible,
      onClose,
      mousePosition = {
        x: 0,
        y: 0,
      },
    } = this.props;
    const { x, y } = mousePosition;
    const { width, height } = this.state.size;
    console.log('----mousePosition-', mousePosition);
    return (
      <Dialog
        wrapClassName={`${prefixCls}-preview`}
        bodyStyle={{
          padding: 0,
        }}
        mousePosition={{
          x,
          y,
        }}
        style={{
          width,
          height,
        }}
        visible={visible}
        animation="zoom"
        closable={false}
        maskAnimation="fade"
        onClose={onClose}
        forceRender={true}
      >
        <img
          src={src}
          alt={alt}
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </Dialog>
    );
  }
}

polyfill(Preview);

export default Preview;
