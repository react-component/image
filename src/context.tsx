import * as React from 'react';
import { ImageProps } from './Image';

export interface GroupConsumerProps {
  preview?: ImageProps['preview'];
}

export default React.createContext<GroupConsumerProps>({});
