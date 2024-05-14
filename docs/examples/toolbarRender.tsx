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
                onReset,
              },
            },
          ) => {
            return (
              <div
                style={{ position: 'fixed', display: 'flex', bottom: 100, width: '100%', gap: 10, justifyContent: 'center' }}
              >
                <button onClick={onFlipY}>flipY</button>
                <button onClick={() => onReset("flipY")}>reset flipY</button>
                <button onClick={onFlipX}>flipX</button>
                <button onClick={() => onReset("flipX")}>reset flipX</button>
                <button onClick={onRotateLeft}>rotateLeft</button>
                <button onClick={onRotateRight}>rotateRight</button>
                <button onClick={() => onReset("rotate")}>reset rotate</button>
                <button onClick={onZoomIn}>zoomIn</button>
                <button onClick={onZoomOut}>zoomOut</button>
                <button onClick={() => onReset("zoom")}>reset zoom</button>
                <button onClick={onClose}>close</button>
                
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
