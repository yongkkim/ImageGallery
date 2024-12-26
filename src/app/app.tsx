import UploadImage from "../featureComponents/selectAndLoadImage/selectAndLoadImage";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "./store";
import {
  resetPreviewImages,
  setOpenUploadModal,
} from "../featureComponents/selectAndLoadImage/selectAndLoadImageSlice";
import Gallery from "../featureComponents/gallery/gallery";
import ImageActionsMenu from "../featureComponents/imageActionsMenu/imageActionsMenu";
import { useEffect, useState } from "react";
import Cancel from "../resource/images/cancelButton.svg";

const App = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isConfirmOpen, setIsConfirmOpen] = useState(true);
  const dispatch = useDispatch<AppDispatch>();
  const openUpLoadModal = useSelector(
    (state: RootState) => state.imageContainer.openUploadModal
  );
  const isSaved = useSelector(
    (state: RootState) => state.imageContainer.isSaved
  );
  const isLoaded = useSelector(
    (state: RootState) => state.imageContainer.isLoaded
  );

  // Automatically hide the message after 4 seconds
  useEffect(() => {
    if (isLoaded || isSaved) {
      const timer = setTimeout(() => setIsVisible(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [isLoaded, isSaved]);

  useEffect(() => {
    if (openUpLoadModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [openUpLoadModal]);

  const images = useSelector((state: RootState) => state.imageContainer.images);
  const isConfirmMessage = (isLoaded || isSaved) && isConfirmOpen;

  const buttonText = images.length > 0 ? "Add more" : "Let's begin";
  const closeModal = () => {
    dispatch(setOpenUploadModal(false));
    dispatch(resetPreviewImages());
  };
  const confirmMessage = () => {
    const message = isLoaded ? "loaded" : "saved";
    return (
      <div
        className={`flex justify-center items-center p-[10px] bg-opacity-70 bg-blue-500 fixed top-[185px] right-0 left-0 text-white z-50 w-2/4 m-auto transition-opacity duration-500 ${
          isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        The gallery is sucessfully {message}
        <Cancel
          onClick={() => setIsConfirmOpen(false)}
          className="image-menu-option cursor-pointer m-0 absolute right-0 fill-current text-white hover:text-[rgb(0,0,0)]"
        />
      </div>
    );
  };

  return (
    <div className={`${openUpLoadModal && "overflow-y-hidden"}`}>
      <h1 className="text-teal-600 text-center text-4xl font-bold py-6">
        Images Gallery
      </h1>
      <h3 className="text-teal-500 text-center text-xl py-3 px-4">
        Effortlessly upload, showcase, and explore your images with ease!
      </h3>
      {isConfirmMessage && confirmMessage()}
      <ImageActionsMenu
        setIsConfirmOpen={setIsConfirmOpen}
        setIsVisible={setIsVisible}
      />
      <button
        className="block m-auto bg-teal-500 text-white font-bold py-2 px-4 rounded hover:bg-teal-600"
        onClick={() => dispatch(setOpenUploadModal(true))}
      >
        {buttonText}
      </button>
      {openUpLoadModal && (
        <>
          <div
            className="fixed inset-0 bg-white bg-opacity-[0.95] z-40"
            onClick={() => closeModal()}
          ></div>
          <UploadImage />
        </>
      )}
      <Gallery />
    </div>
  );
};

export default App;
