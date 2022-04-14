/* eslint-disable global-require */
import * as React from 'react';
import Image from 'rc-image';
import '../../assets/index.less';

export default function Base() {
  const [visible, setVisible] = React.useState(false);
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
          visible,
          onVisibleChange: value => {
            setVisible(value);
          },
          current: 1,
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
