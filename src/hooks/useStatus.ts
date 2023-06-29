import { useEffect, useRef, useState } from 'react';
import { isImageValid } from '../util';

type ImageStatus = 'normal' | 'error' | 'loading';

export default function useStatus({
  src,
  isCustomPlaceholder,
  fallback,
}: {
  src: string;
  isCustomPlaceholder?: boolean;
  fallback?: string;
}) {
  const [status, setStatus] = useState<ImageStatus>(isCustomPlaceholder ? 'loading' : 'normal');
  const isLoaded = useRef(false);

  const isError = status === 'error';

  // https://github.com/react-component/image/pull/187
  useEffect(() => {
    isImageValid(src).then(isValid => {
      if (!isValid) {
        setStatus('error');
      }
    });
  }, [src]);

  useEffect(() => {
    if (isCustomPlaceholder && !isLoaded.current) {
      setStatus('loading');
    } else if (isError) {
      setStatus('normal');
    }
  }, [src]);

  const onLoad = () => {
    setStatus('normal');
  };

  const getImgRef = (img?: HTMLImageElement) => {
    isLoaded.current = false;
    if (status !== 'loading') {
      return;
    }
    if (img?.complete && (img.naturalWidth || img.naturalHeight)) {
      isLoaded.current = true;
      onLoad();
    }
  };

  const srcAndOnload = isError && fallback ? { src: fallback } : { onLoad, src };

  return [getImgRef, srcAndOnload, status] as const;
}
