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
