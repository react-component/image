import Image from '@rc-component/image';
import * as React from 'react';
import '../../assets/index.less';
import { defaultIcons } from './common';

export default function PreviewVideo() {
  return (
    <div>
      <Image
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?x-oss-process=image/auto-orient,1/resize,p_10/quality,q_10"
        preview={{
          icons: defaultIcons,
          type: 'video',
          src: 'https://gw.alipayobjects.com/os/rmsportal/NTMlQdLIkPjOACXsdRrq.mp4',
        }}
        width={200}
      />

      <br />
      <h1>PreviewGroup</h1>
      <Image.PreviewGroup preview={{ icons: defaultIcons }}>
        <Image
          key={1}
          src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
          preview={{
            src: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
          }}
          width={200}
        />
        <Image
          key={2}
          src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
          preview={{
            type: 'video',
            src: 'https://gw.alipayobjects.com/os/rmsportal/NTMlQdLIkPjOACXsdRrq.mp4',
          }}
          width={200}
        />
      </Image.PreviewGroup>
    </div>
  );
}
