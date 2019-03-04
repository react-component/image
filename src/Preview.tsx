import cls from 'classnames';
import Dialog from 'rc-dialog';
import 'rc-dialog/assets/index.css';
import * as React from 'react';
import { polyfill } from 'react-lifecycles-compat';

interface IPreviewState {
  size?: {
    width: number;
    height: number;
  };
}

export interface IPreviewProps {
  prefixCls?: string;
  src?: string;
  alt?: string;
  visible?: boolean;
  onClose: (e?: React.SyntheticEvent) => void;
  mousePosition?: {
    x: number;
    y: number;
  };
  size?: {
    width: number;
    height: number;
  };
}

class Preview extends React.Component<IPreviewProps, IPreviewState> {
  constructor(props: IPreviewProps) {
    super(props);
    this.state = {
      size: undefined,
    };
  }
  public handleScroll = () => {
    this.props.onClose();
  };
  // public static getDerivedStateFromProps = (nextProps: IPreviewProps, prevState: IPreviewState) => {
  //   if (!nextProps.size) {
  //     const { size } = nextProps;
  //     return {
  //       size,
  //     }
  //   }
  //   return null;
  // }
  public componentWillReceiveProps(nextProps: IPreviewProps) {
    if (nextProps.size) {
      this.setState({
        size: nextProps.size,
      });
    }
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
    const { width = 0, height = 0 } = this.state.size || {};
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
        onCloseScroll={true}
        forceRender={true}
      >
        <img
          src={src}
          className={`${prefixCls}-zoomOut`}
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
