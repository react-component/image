import * as React from 'react';
import type { OnGroupPreview, RegisterImage } from './interface';

export interface PreviewGroupContextProps {
  register: RegisterImage;
  onPreview: OnGroupPreview;
  canPreview: boolean;
}

export const PreviewGroupContext = React.createContext<PreviewGroupContextProps | null>(null);
