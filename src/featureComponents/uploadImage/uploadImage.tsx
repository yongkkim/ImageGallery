import React, { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../app/store";
import {
  saveImages,
  setPreviewImages,
  resetPreviewImages,
  setOpenUploadModal,
  setIsPreviewLoading,
  setIsGalleryLoading,
} from "./uploadImageSlice";
import PreviewImage from "../previewImage/previewImage";

const uploadContainer = () => {
  const dispatch = useDispatch<AppDispatch>();
  const images = useSelector((state: RootState) => state.imageContainer.images);
  const previewImages = useSelector(
    (state: RootState) => state.imageContainer.previewImages
  );
  const imageRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      dispatch(setIsPreviewLoading(true));
      const fileArray = Array.from(e.target.files);
      const fileURLs = fileArray.map((file) => {
        return {
          name: file.name,
          blob: file,
          favorite: false,
          comment: "",
          commentModal: false,
          editComment: false,
        };
      });
      const filteredURLs =
        previewImages.length === 0
          ? fileURLs
          : fileURLs.filter((url) =>
              previewImages.every((preview) => preview.name !== url.name)
            );
      dispatch(setPreviewImages(filteredURLs));
    }

    if (imageRef.current) {
      imageRef.current.value = "";
    }
  };

  const handleAdd = () => {
    dispatch(saveImages(previewImages));
    dispatch(resetPreviewImages());
    dispatch(setOpenUploadModal(false));
    dispatch(setIsGalleryLoading(true));
  };

  const handleCancel = () => {
    dispatch(resetPreviewImages());
    dispatch(setOpenUploadModal(false));
  };

  return (
    <div className="flex m-auto w-full flex-col justify-center items-center fixed left-0 right-0 m-auto z-50 top-[70px]">
      <PreviewImage />
      <div className="flex flex-row w-[90%] border-b-2 border-black">
        <button
          className="preview-btn hover:bg-teal-600 hover:text-white"
          onClick={() => imageRef.current?.click()}
        >
          Select Photos
        </button>
        <button
          className={`preview-btn ${
            previewImages.length <= 0
              ? "text-stone-300"
              : "hover:bg-teal-600 hover:text-white"
          }`}
          onClick={() => handleAdd()}
          disabled={previewImages.length <= 0}
        >
          Add Photos
        </button>
        <button
          className={`preview-btn ${
            previewImages.length <= 0
              ? "text-stone-300"
              : "hover:bg-red-700 hover:text-white"
          }`}
          onClick={() => dispatch(resetPreviewImages())}
          disabled={previewImages.length <= 0}
        >
          Reset
        </button>
        <button
          className={"preview-btn hover:bg-orange-600 hover:text-white"}
          onClick={() => handleCancel()}
        >
          Cancel
        </button>
      </div>
      <input
        type="file"
        className="hidden"
        onChange={handleChange}
        multiple
        ref={imageRef}
      />
    </div>
  );
};

export default uploadContainer;
