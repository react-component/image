/* eslint-disable global-require */
import * as React from 'react';
import Image from 'rc-image';
import '../../assets/index.less';

export default function PreviewGroup() {
  return (
    <div>
      <Image.PreviewGroup>
        <Image wrapperStyle={{ marginRight: 24, width: 200 }} src={require('./images/1.jpeg')} />
        <Image
          wrapperStyle={{ marginRight: 24, width: 200 }}
          preview={false}
          src={require('./images/disabled.jpeg')}
        />
        <Image wrapperStyle={{ marginRight: 24, width: 200 }} src={require('./images/2.jpeg')} />
        <Image wrapperStyle={{ marginRight: 24, width: 200 }} src={require('./images/3.jpeg')} />
        <Image wrapperStyle={{ marginRight: 24, width: 200 }} src='error' alt="error" />
        <Image wrapperStyle={{ marginRight: 24, width: 200 }} src={require('./images/1.jpeg')} />
      </Image.PreviewGroup>
    </div>
  );
}
