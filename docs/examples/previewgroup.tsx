import {
  CloseOutlined,
  LeftOutlined,
  RightOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  SwapOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from '@ant-design/icons';
import Image from 'rc-image';
import React from 'react';
import '../../assets/index.less';

const icons = {
  rotateLeft: <RotateLeftOutlined />,
  rotateRight: <RotateRightOutlined />,
  zoomIn: <ZoomInOutlined />,
  zoomOut: <ZoomOutOutlined />,
  close: <CloseOutlined />,
  left: <LeftOutlined />,
  right: <RightOutlined />,
  flipX: <SwapOutlined />,
  flipY: <SwapOutlined rotate={90} />,
};

export default function PreviewGroup() {
  return (
    <div>
      <Image.PreviewGroup
        icons={icons}
        preview={{
          countRender: (current, total) => `第${current}张 / 总共${total}张`,
          onChange: (current, prev) =>
            console.log(`当前第${current}张，上一次第${prev === undefined ? '-' : prev}张`),
        }}
      >
        <Image wrapperStyle={{ marginRight: 24, width: 200 }} src={require('./images/1.jpeg')} />
        <Image
          wrapperStyle={{ marginRight: 24, width: 200 }}
          preview={false}
          src={require('./images/disabled.jpeg')}
        />
        <Image wrapperStyle={{ marginRight: 24, width: 200 }} src={require('./images/2.jpeg')} />
        <Image wrapperStyle={{ marginRight: 24, width: 200 }} src={require('./images/3.jpeg')} />
        <Image wrapperStyle={{ marginRight: 24, width: 200 }} src="error" alt="error" />
        <Image wrapperStyle={{ marginRight: 24, width: 200 }} src={require('./images/1.jpeg')} />
      </Image.PreviewGroup>
    </div>
  );
}
