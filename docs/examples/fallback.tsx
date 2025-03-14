import Image from '@rc-component/image';
import * as React from 'react';
import '../../assets/index.less';
import { defaultIcons } from './common';

export default function Base() {
  return (
    <Image
      preview={{ cover: 'preview!', icons: defaultIcons }}
      src="error1"
      fallback="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
      width={200}
    />
  );
}
