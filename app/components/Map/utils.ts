export const getMarker = (selector: string): any => {
  const MAX_TRIES = 100;
  let tries = 0;
  return new Promise((resolve, __) => {
    const pollMarker = (): any => {
      const markerDom = document.querySelector(selector) as HTMLImageElement;
      if (!markerDom && tries < MAX_TRIES) {
        tries++;
        return setTimeout(pollMarker, 200);
      }
      return resolve(markerDom);
    };
    pollMarker();
  });
};
