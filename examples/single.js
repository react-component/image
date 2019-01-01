/* eslint no-console: 0 */

import React from 'react';
import Image from 'rc-image';
import 'rc-image/assets/index.less';
import ReactDOM from 'react-dom';

class Test extends React.Component {

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

ReactDOM.render(<Test />, document.getElementById('__react-content'));
