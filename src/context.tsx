import * as React from 'react';
import { ImageProps } from './Image';

export interface GroupConsumerProps {
  mergedPreview?: boolean;
  prefixCls?: ImageProps['prefixCls'];
  previewPrefixCls?: ImageProps['previewPrefixCls'];
}

export interface GroupConsumerValue extends GroupConsumerProps {
  previewUrls: string[];
  setPreviewUrls: React.Dispatch<React.SetStateAction<string[]>>;
  setCurrent: React.Dispatch<React.SetStateAction<string>>;
  setShowPreview: React.Dispatch<React.SetStateAction<boolean>>;
  setMousePosition: React.Dispatch<React.SetStateAction<null | { x: number; y: number }>>;
}

export default React.createContext<GroupConsumerValue>({
  previewUrls: [],
  setPreviewUrls: () => null,
  setCurrent: () => null,
  setShowPreview: () => null,
  setMousePosition: () => null,
});
