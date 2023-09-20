import Image from 'rc-image';
import React from 'react';
import '../../assets/index.less';

export default function PreviewGroup() {
  return (
    <div>
      <Image.PreviewGroup
        items={[require('./images/1.jpeg'), require('./images/2.jpeg'), require('./images/3.jpeg')]}
      >
        <Image src={require('./images/1.jpeg')} />
      </Image.PreviewGroup>
    </div>
  );
}
