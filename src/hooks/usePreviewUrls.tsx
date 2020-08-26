import * as React from 'react';

const groupCache = new Map<string, Set<string>>();

export default function usePreviewUrls(src: string, groupKey?: string): [string[]] {
  const groupKeyRef = React.useRef<string>(groupKey);
  const srcRef = React.useRef<string>(src);

  React.useEffect(() => {
    if (groupKey !== groupKeyRef.current || src !== srcRef.current) {
      const set = groupCache.get(groupKeyRef.current);
      if (set) {
        set.delete(srcRef.current);
      }
      groupKeyRef.current = groupKey;
      srcRef.current = src;
    }
    if (groupKey && src) {
      let set = groupCache.get(groupKey);
      if (set) {
        if (!set.has(src)) {
          set.add(src);
        }
      } else {
        set = new Set();
        set.add(src);
        groupCache.set(groupKey, set);
      }
    }
    return () => {
      groupCache.forEach((set, key) => {
        if (set || set.size === 0) {
          groupCache.delete(key);
        } else if (key === groupKey) {
          set.delete(src);
          groupCache.set(key, set);
        }
      });
    };
  }, [src, groupKey]);

  return [groupKey ? Array.from(groupCache.get(groupKey) || []) : [src]];
}
