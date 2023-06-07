import Image from 'rc-image';
import '../../assets/index.less';

export default function ToolbarRender() {
  return (
    <div>
      <Image
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        width={200}
        preview={{
          toolbarRender: ({
            actions: { flipY, flipX, rotateLeft, rotateRight, zoomIn, zoomOut, close },
          }) => {
            return (
              <div
                style={{ position: 'fixed', display: 'flex', bottom: 0, width: '100%', gap: 10 }}
              >
                <div onClick={flipY}>flipY</div>
                <div onClick={flipX}>flipX</div>
                <div onClick={rotateLeft}>rotateLeft</div>
                <div onClick={rotateRight}>rotateRight</div>
                <div onClick={zoomIn}>zoomIn</div>
                <div onClick={zoomOut}>zoomOut</div>
                <div onClick={close}>close</div>
              </div>
            );
          },
        }}
      />
    </div>
  );
}
