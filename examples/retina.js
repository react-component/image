/* eslint no-console: 0 */

import React from 'react';
import Image from 'rc-image';
import 'rc-image/assets/index.less';
import ReactDOM from 'react-dom';


class Test extends React.Component {
  state = {
    imageState: 'loading',
  }
  onLoad = () => {
    this.setState({
      imageState: 'loaded',
    })
  }
  onError = () => {
    this.setState({
      imageState: 'error',
    })
  }
  loading = (
    <Image
      wrapperStyle={{ width: '100%', backgroundColor: '#fff' }}
      src="//gw.alipayobjects.com/zos/rmsportal/WScIlUSVnQcmbyqtDtoN.gif"
      style={{ width: '100%' }}
    />
  );
  render() {
    return (
      <div style={{ margin: 20 }}>
        <h2>Retina Image</h2>

        <div style={{ width: 300 }}>
          <h3>ImageState: {this.state.imageState}</h3>
          <Image
            placeholder={this.loading}
            onLoad={this.onLoad}
            onError={this.onError}
            src="https://gw.alipayobjects.com/zos/rmsportal/tErBXqDWzPdhqEkVbpvv.png"
            onL
            srcSet="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png 2x"
          />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Test />, document.getElementById('__react-content'));
