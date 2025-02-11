import { ImageInfo } from "../featureComponents/selectAndLoadImage/selectAndLoadImageSlice";

export const findImageIndex = (container: Array<ImageInfo>, image: string) => {
  return container.findIndex((item) => (item.name = image));
};

export const adjustGrid = (
  gridItems: HTMLElement[],
  container: HTMLElement
): void => {
  //checking if images are loaded
  if (container.childElementCount === 0) return;

  //dynamically adjusts the grid row span based on the image height
  gridItems.forEach((item, index) => {
    const itemHeight = item.querySelector("img")?.offsetHeight ?? 0;

    item.style.gridRowStart = `span ${Math.ceil(itemHeight / 20)}`;
  });
};

export const getTailwindWidthString = (width: string) => {
  return `${`w-[${width}px]`}`;
};
