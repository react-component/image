import * as React from 'react';
import Image from '../src';
import '../assets/index.less';

export default function Urls() {
  const urls = [
    'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    'https://gw.alipayobjects.com/mdn/rms_08e378/afts/img/A*P0S-QIRUbsUAAAAAAAAAAABkARQnAQ',
    'https://gw.alipayobjects.com/mdn/rms_08e378/afts/img/A*ngiJQaLQELEAAAAAAAAAAABkARQnAQ',
  ];
  return (
    <div>
      {urls.map(url => (
        <Image
          groupKey="preview"
          key={url}
          src={url}
          preview={{
            current: url, // 不传默认src
            urls,
          }}
          width={200}
          style={{
            marginRight: 24,
          }}
        />
      ))}
      <Image
        id="preview-group-1"
        groupKey="preview"
        src="https://gw.alipayobjects.com/mdn/rms_08e378/afts/img/A*NZuwQp_vcIQAAAAAAAAAAABkARQnAQ"
        width={200}
        style={{
          marginRight: 24,
        }}
      />
    </div>
  );
}
