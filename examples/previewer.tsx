import * as React from 'react';
import Image from '../src';
import '../assets/index.less';

export default function Base() {
  return (
    <button
      onClick={() => {
        Image.previewer(
          'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        );
      }}
    >
      预览
    </button>
  );
}
