import * as React from 'react';
import Image from '../src';
import { ImageFit } from '../src/Image';
import '../assets/index.less';

export default function ObjectFit() {
  const types: ImageFit[] = ['fill', 'contain', 'cover', 'none', 'scale-down'];

  return (
    <div>
      {types.map(type => (
        <Image
          key={type}
          src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
          width={200}
          height={200}
          fit={type}
          style={{ marginRight: 20, marginBottom: 20 }}
        />
      ))}
    </div>
  );
}
