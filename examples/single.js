/* eslint no-console: 0 */

import React from 'react';
import Image from '../src';
import ReactLoading from 'react-loading';

import '../assets/index.less';

export default class Test extends React.Component {
  render() {
    const Loading = (
      <ReactLoading type="spin" color="#1890ff" />
    )
    return (
      <div style={{ margin: 20 }}>
        <h2>Single Image</h2>

        <div style={{ width: 300 }}>
          <Image
            src="https://picsum.photos/458/354?image=0"
            placeholder={Loading}
          />
        </div>
      </div>
    );
  }
}
