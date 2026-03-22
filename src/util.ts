import * as React from 'react';
import type { FetchPriority } from './interface';

export function isImageValid(src: string) {
  return new Promise(resolve => {
    if (!src) {
      resolve(false);
      return;
    }
    const img = document.createElement('img');
    img.onerror = () => resolve(false);
    img.onload = () => resolve(true);
    img.src = src;
  });
}

export function getFetchPriorityProps(value?: FetchPriority) {
  if (!value) {
    return {};
  }

  const major = Number(React.version.split('.')[0]);

  return major >= 19 ? { fetchPriority: value } : { fetchpriority: value };
}

// ============================= Legacy =============================
export function getClientSize() {
  const width = document.documentElement.clientWidth;
  const height = window.innerHeight || document.documentElement.clientHeight;
  return {
    width,
    height,
  };
}
