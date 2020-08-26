import * as React from 'react';
import Image from '../src';
import '../assets/index.less';

export default function Preview() {
  return (
    <div>
      <Image
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        preview={{
          groupKey: 'preview',
        }}
        width={200}
        style={{
          marginRight: 24,
        }}
      />
      <Image
        src="https://gw.alipayobjects.com/mdn/rms_08e378/afts/img/A*P0S-QIRUbsUAAAAAAAAAAABkARQnAQ"
        preview={{
          groupKey: 'preview',
        }}
        width={200}
        style={{
          marginRight: 24,
        }}
      />
      <Image
        src="https://gw.alipayobjects.com/mdn/rms_08e378/afts/img/A*ngiJQaLQELEAAAAAAAAAAABkARQnAQ"
        preview={{
          groupKey: 'preview',
        }}
        width={200}
        style={{
          marginRight: 24,
        }}
      />
      <Image
        src="https://gw.alipayobjects.com/mdn/rms_08e378/afts/img/A*NZuwQp_vcIQAAAAAAAAAAABkARQnAQ"
        preview={{
          groupKey: 'preview',
        }}
        width={200}
        style={{
          marginRight: 24,
        }}
      />
    </div>
  );
}
