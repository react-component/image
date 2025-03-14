import Image from '@rc-component/image';
import * as React from 'react';
import '../../assets/index.less';
import { defaultIcons } from './common';

export default function Base() {
  const [open, setOpen] = React.useState(false);
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
      <Image
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        width={200}
        preview={{
          icons: defaultIcons,
          open,
          onOpenChange: value => {
            setOpen(value);
          },
        }}
      />
    </div>
  );
}
