import Image from '@rc-component/image';
import * as React from 'react';
import '../../assets/index.less';
import { defaultIcons } from './common';

export default function Base() {
  return (
    <div>
      <Image
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        width={200}
        style={{
          marginRight: 24,
        }}
        onClick={() => {
          console.log('click');
        }}
        preview={{
          icons: defaultIcons,
          onOpenChange: open => {
            console.log('open', open);
          },
          zIndex: 9999,
        }}
      />

      <Image
        src="https://gw.alipayobjects.com/mdn/rms_08e378/afts/img/A*P0S-QIRUbsUAAAAAAAAAAABkARQnAQ"
        width={200}
        style={{
          marginRight: 24,
        }}
        preview={{ icons: defaultIcons, cover: 'Click to Preview' }}
      />
      <Image
        src="https://gw.alipayobjects.com/mdn/rms_08e378/afts/img/A*ngiJQaLQELEAAAAAAAAAAABkARQnAQ"
        width={200}
        style={{
          marginRight: 24,
        }}
        preview={{ icons: defaultIcons }}
      />
      <Image
        src="https://gw.alipayobjects.com/mdn/rms_08e378/afts/img/A*NZuwQp_vcIQAAAAAAAAAAABkARQnAQ"
        width={200}
        preview={{ icons: defaultIcons }}
      />

      <Image
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        width={200}
        height={100}
        preview={{ icons: defaultIcons }}
      />
    </div>
  );
}
