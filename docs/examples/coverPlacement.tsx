import type { CoverConfig } from '@rc-component/image';
import Image from '@rc-component/image';
import * as React from 'react';
import '../../assets/index.less';
import { defaultIcons } from './common';

export default function Base() {
  const [placement, setPlacement] = React.useState<CoverConfig["placement"]>('center');
  return (
    <div>
      <div>
        <label htmlFor="placement">
          <span>placement:</span>
        </label>
        <select id="placement" onChange={e => setPlacement(e.target.value as CoverConfig["placement"])} value={placement}>
          <option value="top">top</option>
          <option value="bottom">bottom</option>
          <option value="center">center</option>
        </select>
      </div>
      <br />
      <Image
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        width={200}
        onClick={() => {
          console.log('click');
        }}
        preview={{
          icons: defaultIcons,
          onOpenChange: open => {
            console.log('open', open);
          },
          zIndex: 9999,
          cover: {
            coverNode: 'Click to Preview',
            placement,
          },
        }}
      />
    </div>
  );
}
