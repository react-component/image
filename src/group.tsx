import * as React from 'react';
import context, { GroupConsumerProps } from './context';

const { Provider } = context;

const Group: React.FC<GroupConsumerProps> = ({ preview, ...others }) => (
  <Provider
    value={{
      preview,
    }}
    {...others}
  />
);

export default Group;
