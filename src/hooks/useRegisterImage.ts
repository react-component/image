import * as React from 'react';
import { PreviewGroupContext } from '../context';
import type { ImageElementProps } from '../interface';

let uid = 0;

export default function useRegisterImage(canPreview: boolean, data: ImageElementProps) {
  const [id] = React.useState(() => {
    uid += 1;
    return String(uid);
  });
  const groupContext = React.useContext(PreviewGroupContext);

  const registerData = {
    data,
    canPreview,
  };

  // Keep order start
  // Resolve https://github.com/ant-design/ant-design/issues/28881
  // Only need unRegister when component unMount
  React.useEffect(() => {
    if (groupContext) {
      return groupContext.register(id, registerData);
    }
  }, []);

  React.useEffect(() => {
    if (groupContext) {
      groupContext.register(id, registerData);
    }
  }, [canPreview, data]);

  return id;
}
