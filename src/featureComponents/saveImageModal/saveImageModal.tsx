import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../app/store";
import { uploadImages } from "../uploadImage/uploadImageSlice";
import Loading from "../sharedComponents/loading/loading";

type saveImageModalProps = {
  setOpenSave: React.Dispatch<React.SetStateAction<boolean>>; // Example for a string state
};

const saveImageModal: React.FC<saveImageModalProps> = ({ setOpenSave }) => {
  const [galleryName, setGalleryName] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const images = useSelector((state: RootState) => state.imageContainer.images);
  const isSaveProcessing = useSelector(
    (state: RootState) => state.imageContainer.isSaveProcessing
  );

  const handleUpdateImageInfo = async () => {
    dispatch(uploadImages({ images, galleryName })).then(() => {
      setOpenSave(false);
    });
  };

  return (
    <div className="flex flex-col flex-wrap items-center justify-center pt-[10px] fixed z-50 w-2/4 border-2 border-black rounded-[10px] top-[30%] left-[50%] -translate-x-2/4">
      {isSaveProcessing && (
        <div className="absolute rounded-[12px] inset-0 flex items-center justify-center bg-gray-100/80 z-50">
          <Loading />
        </div>
      )}
      <input
        type="text"
        className="w-11/12 outline-none px-[5px] py-[3px] border-b-2 border-black"
        maxLength={50}
        placeholder="Type a name of the gallery"
        autoFocus
        value={galleryName}
        onChange={(e) => setGalleryName(e.target.value)}
      />
      <div className="flex w-[86%] pt-[5px] pb-[8px]">
        <button
          onClick={() => setOpenSave(false)}
          className="block rounded-[10px] flex-1 py-[1px] hover:text-white hover:bg-black hover:bg-opacity-60"
        >
          Cancel
        </button>
        <button
          onClick={() => handleUpdateImageInfo()}
          className="block rounded-[10px] flex-1 py-[1px] hover:text-white hover:bg-black hover:bg-opacity-60"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default saveImageModal;
