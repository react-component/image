/* eslint no-console: 0 */

import React from 'react';
import Image from '../src';
import '../assets/index.less';

const Test = () => (
  <div style={{ margin: 20 }}>
    <h2>Image Zoom</h2>
    <div style={{ width: 460 }}>
      <p>Hello Image</p>
      <Image
        style={{
          width: '100%',
        }}
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
      />
    </div>
    <div style={{ float: 'right' }}>
      <p>Hello Image</p>
      <Image
        style={{
          width: '100%',
          textAlign: 'right',
        }}
        src="https://gw.alipayobjects.com/zos/antfincdn/c5b247c2-947a-4831-9609-c24e35d1b1bc/9943d4fe-1f5f-4d31-9617-11227808be64/paris.jpg"
      />
    </div>
    <div style={{ width: 600, margin: 'auto' }}>
      <Image
        style={{
          width: '100%',
        }}
        src="https://gw.alipayobjects.com/zos/antfincdn/3ef66987-8c9d-40d6-9bca-c8d8111644bc/4ca227cb-d8f8-4a2b-9788-23c6ddd869f1/palm.jpg"
      />
    </div>
  </div>
);

export default Test;
