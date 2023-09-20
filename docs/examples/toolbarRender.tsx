import Image from 'rc-image';
import React from 'react';
import '../../assets/index.less';

export default function ToolbarRender() {
  return (
    <div>
      <Image
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        width={200}
        preview={{
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
    </div>
  );
}
