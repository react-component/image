import * as React from 'react';
import Image from '../src';
import '../assets/index.less';

export default function Base() {
  return (
    <Image
      src="error1"
      fallback="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
      width={200}
    />
  );
}
