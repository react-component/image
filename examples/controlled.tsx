import * as React from 'react';
import Image from '../src';
import '../assets/index.less';

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
      <Image
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        width={200}
        preview={{
          visible,
          onVisibleChange: value => {
            setVisible(value);
          },
        }}
      />
    </div>
  );
}
