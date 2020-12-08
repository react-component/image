/* eslint-disable global-require */
import * as React from 'react';
import Image from '../src';
import '../assets/index.less';

export default function PreviewGroup() {
  return (
    <div>
      <Image.PreviewGroup>
        <Image src={require('./images/1.jpeg')} />
        <Image preview={false} src={require('./images/disabled.jpeg')} />
        <Image src={require('./images/2.jpeg')} />
        <Image src={require('./images/3.jpeg')} />
        <Image src={require('./images/1.jpeg')} />
      </Image.PreviewGroup>
    </div>
  );
}
