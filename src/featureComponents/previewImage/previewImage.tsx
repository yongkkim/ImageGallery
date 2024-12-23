import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../app/store";
import Image from "../sharedComponents/image/image";
import Loading from "../sharedComponents/loading/loading";
import { setIsPreviewLoading } from "../uploadImage/uploadImageSlice";

const previewImage = () => {
  const previewImages = useSelector(
    (state: RootState) => state.imageContainer.previewImages
  );
  const isLoading = useSelector(
    (state: RootState) => state.imageContainer.isPreviewLoading
  );
  const dispatch = useDispatch<AppDispatch>();

  const [loadedCount, setLoadedCount] = useState(0);

  const handleImageLoad = () => {
    setLoadedCount((prevCount) => prevCount + 1);
  };

  // Check if all images are loaded
  useEffect(() => {
    if (loadedCount === previewImages.length) {
      dispatch(setIsPreviewLoading(false));
    }
  }, [loadedCount, previewImages]);

  return (
    <div className="block w-[90%] bg-white text-center">
      <h1 className="text-teal-600 text-center text-4xl font-bold py-6">
        Preview images
      </h1>
      <h3 className="text-teal-500 text-center text-xl py-3 px-4">
        You can delete images before you display them in the main gallery
      </h3>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 z-10">
          <Loading />
        </div>
      )}
      <div className="grid grid-cols-1 m-auto sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 border-2 border-black overflow-y-auto h-[390px] top-[55px] custom-scrollbar">
        {previewImages.map((preview, index) => (
          <Image
            key={"image" + index}
            image={preview}
            handleImageLoad={handleImageLoad}
          />
        ))}
      </div>
    </div>
  );
};

export default previewImage;
