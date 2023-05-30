import { useCallback, useEffect } from "react";

export default function useSwitchResetTransform(imgRef: HTMLElement, resetFn: () => void, transform) {
  let fistRender = true
  let originTransition
  useEffect(() => {
    if (imgRef && fistRender) {
      originTransition = window.getComputedStyle(imgRef)['transition']
      fistRender = false
    }
  }, [imgRef])

  const switchResetTransform = useCallback(() => {
    if (imgRef) {
      imgRef.style.transition = 'none'
      resetFn()
      setTimeout(() => {
        imgRef.style.transition = originTransition
      }, 100);
    }
  }, [imgRef])

  return [switchResetTransform]
}
