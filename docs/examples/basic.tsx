import * as React from 'react';
import Image from 'rc-image';
import '../../assets/index.less';

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
          onVisibleChange: visible => {
            console.log('visible', visible);
          },
        }}
      />

      <Image
        src="https://gw.alipayobjects.com/mdn/rms_08e378/afts/img/A*P0S-QIRUbsUAAAAAAAAAAABkARQnAQ"
        width={200}
        style={{
          marginRight: 24,
        }}
        preview={{ mask: 'Click to Preview' }}
      />
      <Image
        src="https://gw.alipayobjects.com/mdn/rms_08e378/afts/img/A*ngiJQaLQELEAAAAAAAAAAABkARQnAQ"
        width={200}
        style={{
          marginRight: 24,
        }}
      />
      <Image
        src="https://gw.alipayobjects.com/mdn/rms_08e378/afts/img/A*NZuwQp_vcIQAAAAAAAAAAABkARQnAQ"
        width={200}
      />

      <Image
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        width={200}
        height={100}
      />
    </div>
  );
}
