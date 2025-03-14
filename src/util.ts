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

// ============================= Legacy =============================
export function getClientSize() {
  const width = document.documentElement.clientWidth;
  const height = window.innerHeight || document.documentElement.clientHeight;
  return {
    width,
    height,
  };
}
