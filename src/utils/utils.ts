import { ImageInfo } from "../featureComponents/selectAndLoadImage/selectAndLoadImageSlice";

export const findImageIndex = (container: Array<ImageInfo>, image: string) => {
  return container.findIndex((item) => (item.name = image));
};

export const adjustGrid = (
  gridItems: HTMLElement[],
  container: HTMLElement,
  columnWidth: number
): void => {
  const containerWidth = container.offsetWidth;
  const numberOfColumns = Math.floor(containerWidth / columnWidth);
  if (numberOfColumns <= 0) return;

  gridItems.forEach((item, index) => {
    const itemHeight = item.querySelector("img")?.offsetHeight ?? 0;

    item.style.gridRowStart = `span ${Math.ceil(itemHeight / 20)}`;
  });
};

export const getTailwindWidthString = (width: string) => {
  return `${`w-[${width}px]`}`;
};
