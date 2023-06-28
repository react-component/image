import Image from 'rc-image';
import * as React from 'react';
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
          src: 'https://gw.alipayobjects.com/mdn/rms_08e378/afts/img/A*P0S-QIRUbsUAAAAAAAAAAABkARQnAQ',
          onVisibleChange: visible => {
            console.log('visible', visible);
          },
        }}
      />
    </div>
  );
}
