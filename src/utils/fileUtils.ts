export const dataURItoFile = (dataUri: string, fileName: string): File => {
  const arr = dataUri.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1];
  const bStr = atob(arr[1]);
  let n = bStr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bStr.charCodeAt(n);
  }

  return new File([u8arr], fileName, { type: mime });
};
