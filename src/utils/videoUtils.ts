export const dataURItoVideo = (
  dataUri: string,
  fileName: string,
  mime: string
): File => {
  const bStr = atob(dataUri);
  let n = bStr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bStr.charCodeAt(n);
  }

  return new File([u8arr], fileName, { type: mime });
};
