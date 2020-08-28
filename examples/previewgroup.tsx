import * as React from 'react';
import Image from '../src';
import '../assets/index.less';

export default function PreviewGroup() {
  return (
    <div>
      <Image.PreviewGroup>
        <Image
          src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
          width={200}
          style={{
            marginRight: 24,
          }}
        />
        <Image
          src="https://gw.alipayobjects.com/mdn/rms_08e378/afts/img/A*P0S-QIRUbsUAAAAAAAAAAABkARQnAQ"
          width={200}
          style={{
            marginRight: 24,
          }}
        />
        <Image
          src="https://gw.alipayobjects.com/mdn/rms_08e378/afts/img/A*ngiJQaLQELEAAAAAAAAAAABkARQnAQ"
          width={200}
          style={{
            marginRight: 24,
          }}
        />
        <Image
          src="error1"
          fallback="https://gw.alipayobjects.com/mdn/rms_08e378/afts/img/A*NZuwQp_vcIQAAAAAAAAAAABkARQnAQ"
          width={200}
          style={{
            marginRight: 24,
          }}
        />
        <Image.PreviewGroup>
          <Image
            src="https://gw.alipayobjects.com/mdn/rms_08e378/afts/img/A*P0S-QIRUbsUAAAAAAAAAAABkARQnAQ"
            width={200}
            style={{
              marginRight: 24,
            }}
          />
          <Image
            src="https://gw.alipayobjects.com/mdn/rms_08e378/afts/img/A*ngiJQaLQELEAAAAAAAAAAABkARQnAQ"
            width={200}
            style={{
              marginRight: 24,
            }}
          />
        </Image.PreviewGroup>
      </Image.PreviewGroup>
    </div>
  );
}
