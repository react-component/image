import Image from '@rc-component/image';
import React from 'react';
import '../../assets/index.less';
import { defaultIcons } from './common';

export default function imageRender() {
  return (
    <div>
      <Image
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        width={200}
        preview={{
          icons: defaultIcons,
          actionsRender: () => null,
          imageRender: () => (
            <video
              muted
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
