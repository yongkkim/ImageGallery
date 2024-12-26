import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../app/store";
import Image from "../sharedComponents/image/image";
import { adjustGrid } from "../../utils/utils";
import { useEffect, useRef, useState } from "react";
import { setIsGalleryLoading } from "../selectAndLoadImage/selectAndLoadImageSlice";
import Loading from "../sharedComponents/loading/loading";

const gallery: React.FC = () => {
  const images = useSelector((state: RootState) => state.imageContainer.images);
  const containerRef = useRef<HTMLDivElement>(null);
  const isLoading = useSelector(
    (state: RootState) => state.imageContainer.isGalleryLoading
  );
  const dispatch = useDispatch<AppDispatch>();

  const [loadedCount, setLoadedCount] = useState(0);

  const handleImageLoad = () => {
    setLoadedCount((prevCount) => prevCount + 1);
  };

  // Check if all images are loaded
  useEffect(() => {
    if (loadedCount === images.length) {
      dispatch(setIsGalleryLoading(false));
    }
  }, [loadedCount, images]);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const gridItems = Array.from(
      container.querySelectorAll(".grid-item")
    ) as HTMLElement[];
    const images = container.querySelectorAll("img");
    const adjust = () => adjustGrid(gridItems, container, 350);

    // Add a slight delay to ensure DOM updates are complete
    images.forEach((img) => {
      img.onload = () => adjust();
    });

    // Adjust grid on window resize
    window.addEventListener("resize", adjust);
    return () => window.removeEventListener("resize", adjust);
  }, [images]);

  return (
    <div
      ref={containerRef}
      className="grid grid-cols-[repeat(auto-fill,_minmax(350px,_1fr))] gap-4 mx-[10px] my-[60px] bg-white overflow-y-auto"
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 z-10">
          <Loading />
        </div>
      )}
      {images.map((image, index) => (
        <Image
          key={"image_grid_" + index}
          image={image}
          imageStyle={"grid"}
          handleImageLoad={handleImageLoad}
        />
      ))}
    </div>
  );
};

export default gallery;
