/* eslint-disable global-require */
import Image from 'rc-image';
import * as React from 'react';
import '../../assets/index.less';
import { defaultIcons } from './common';

export default function Base() {
  const [visible, setVisible] = React.useState(false);
  const [current, setCurrent] = React.useState(1);
  return (
    <div>
      <div>
        <button
          type="button"
          onClick={() => {
            setVisible(true);
          }}
        >
          Switch Preview
        </button>
      </div>
      <Image.PreviewGroup
        preview={{
          icons: defaultIcons,
          visible,
          onVisibleChange: value => {
            setVisible(value);
          },
          current,
          onChange: c => setCurrent(c),
        }}
      >
        <Image
          src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
          width={200}
        />
        <Image wrapperStyle={{ marginRight: 24, width: 200 }} src={require('./images/1.jpeg')} />
        <Image wrapperStyle={{ marginRight: 24, width: 200 }} src={require('./images/2.jpeg')} />
      </Image.PreviewGroup>
    </div>
  );
}
