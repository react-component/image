import Image from 'rc-image';
import React from 'react';
import '../../assets/index.less';
import { defaultIcons } from './common';

export default function ToolbarRender() {
  return (
    <div>
      <Image
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        width={200}
        preview={{
          icons: defaultIcons,
          toolbarRender: (
            _,
            {
              actions: {
                onFlipY,
                onFlipX,
                onRotateLeft,
                onRotateRight,
                onZoomIn,
                onZoomOut,
                onClose,
              },
            },
          ) => {
            return (
              <div
                style={{ position: 'fixed', display: 'flex', bottom: 0, width: '100%', gap: 10 }}
              >
                <div onClick={onFlipY}>flipY</div>
                <div onClick={onFlipX}>flipX</div>
                <div onClick={onRotateLeft}>rotateLeft</div>
                <div onClick={onRotateRight}>rotateRight</div>
                <div onClick={onZoomIn}>zoomIn</div>
                <div onClick={onZoomOut}>zoomOut</div>
                <div onClick={onClose}>close</div>
              </div>
            );
          },
        }}
      />

      <Image
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        width="200px"
        height="200px"
        alt="test"
        preview={{
          icons: defaultIcons,
          imageRender(_, { image }) {
            return <div>{JSON.stringify(image)}</div>;
          },
          toolbarRender(_, { image }) {
            return <div>{JSON.stringify(image)}</div>;
          },
        }}
      />
    </div>
  );
}
