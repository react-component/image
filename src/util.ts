export function isRetina(): boolean {
  let mediaQuery;
  if (typeof window !== "undefined" && window !== null) {
    mediaQuery = "(-webkit-min-device-pixel-ratio: 1.25), (min--moz-device-pixel-ratio: 1.25), (-o-min-device-pixel-ratio: 5/4), (min-resolution: 1.25dppx)";
    if (window.devicePixelRatio > 1.25) {
      return true;
    }
    if (window.matchMedia && window.matchMedia(mediaQuery).matches) {
      return true;
    }
  }
  return false;
}

export function saveRef(instance: any, name: string): (node: any) => void {
  return (node: JSX.Element) => {
    if (node) {
      instance[name] = node;
    }
  };
}


// screen util funciton
export const getScrollHeight = () => Math.max(
  document.body.scrollHeight, document.documentElement.scrollHeight,
  document.body.offsetHeight, document.documentElement.offsetHeight,
  document.body.clientHeight, document.documentElement.clientHeight
);

export const getClientHeight = () => {
  let clientHeight = 0;
  // tslint:disable-next-line
  if (document.body.clientHeight && document.documentElement.clientHeight) {
    clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
  } else {
    clientHeight = (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
  }
  return clientHeight;
};


export const getWindowWidth = () => window.innerWidth;
export const getScrollWidth = () => document.body.scrollWidth;
export const getClientWidth = () => document.documentElement.clientWidth;
export const getWindowHeight = () => window.innerHeight;
