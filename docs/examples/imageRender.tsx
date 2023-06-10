import Image from 'rc-image';
import '../../assets/index.less';

export default function imageRender() {
  return (
    <div>
      <Image
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        width={200}
        preview={{
          toolbarRender: () => null,
          imageRender: () => (
            <video
              width="100%"
              controls
              src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/file/A*uYT7SZwhJnUAAAAAAAAAAAAADgCCAQ"
            />
          ),
        }}
      />
    </div>
  );
}
