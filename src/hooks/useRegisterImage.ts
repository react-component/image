import * as React from 'react';
import type { ImageElementProps } from '../interface';
import { PreviewGroupContext } from '../context';

let uid = 0;

export default function useRegisterImage(canPreview: boolean, imgData: ImageElementProps) {
  const [id] = React.useState(() => {
    uid += 1;
    return String(uid);
  });
  const groupContext = React.useContext(PreviewGroupContext);

  const registerData = {
    ...imgData,
    canPreview,
  };

  // Keep order start
  // Resolve https://github.com/ant-design/ant-design/issues/28881
  // Only need unRegister when component unMount
  React.useEffect(() => {
    if (groupContext) {
      return groupContext.register(id, registerData);
    }
  }, [canPreview]);

  React.useEffect(() => {
    if (groupContext) {
      return groupContext.register(id, registerData);
    }
  }, [imgData]);

  return id;
}
