/* eslint-disable global-require */
import Image from '@rc-component/image';
import * as React from 'react';
import '../../assets/index.less';
import { defaultIcons } from './common';

export default function Base() {
  const [open, setOpen] = React.useState(false);
  const [current, setCurrent] = React.useState(1);
  return (
    <div>
      <div>
        <button
          type="button"
          onClick={() => {
            setOpen(true);
          }}
        >
          Switch Preview
        </button>
      </div>
      <Image.PreviewGroup
        preview={{
          icons: defaultIcons,
          open,
          onOpenChange: value => {
            setOpen(value);
          },
          current,
          onChange: c => setCurrent(c),
        }}
      >
        <Image
          src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
          width={200}
        />
        <Image
          styles={{ root: { marginRight: 24, width: 200 } }}
          src={require('./images/1.jpeg')}
        />
        <Image
          styles={{ root: { marginRight: 24, width: 200 } }}
          src={require('./images/2.jpeg')}
        />
      </Image.PreviewGroup>
    </div>
  );
}
