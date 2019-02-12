/* eslint no-console: 0 */

import React from 'react';
import Image from '../src';
import '../assets/index.less';

export default class Test extends React.Component {
  render() {
    return (
      <div style={{ margin: 20 }}>
        <h2>Single Image</h2>

        <div style={{ width: 300 }}>
          <Image
            responsive
            src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
          />
        </div>
      </div>
    );
  }
}
