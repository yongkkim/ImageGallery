import React, { useEffect, useRef, useState } from "react";
import SaveImageModal from "../saveImageModal/saveImageModal";
import LoadImageModal from "../loadImageModal/loadImageModal";
import Hamburger from "../../resource/images/hamburger.svg";
import Close from "../../resource/images/cancelButton.svg";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../app/store";
import {
  setIsLoaded,
  setIsSaved,
  setOpenUploadModal,
} from "../selectAndLoadImage/selectAndLoadImageSlice";

type imageActionsMenu = {
  setIsConfirmOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const imageActionsMenu: React.FC<imageActionsMenu> = ({
  setIsConfirmOpen,
  setIsVisible,
}) => {
  const images = useSelector((state: RootState) => state.imageContainer.images);
  const [continueLoad, setContinueLoad] = useState(images.length === 0);
  const [isGalleryClicked, setIsGalleryClicked] = useState(false);
  const [isLoadConfirmOpen, setIsLoadConfirmOpen] = useState(true);
  const dispatch = useDispatch<AppDispatch>();
  const buttonText = images.length > 0 ? "Add" : "Begin";

  const [openMenu, setOpenMenu] = useState(false);
  const [openSave, setOpenSave] = useState(false);
  const [openLoad, setOpenLoad] = useState(false);

  const closeModal = () => {
    setOpenLoad(false);
    setOpenSave(false);
  };

  const handleActions = (action: string) => {
    setOpenMenu(false);
    if (action === "save") {
      setOpenSave(!openSave);
    } else {
      setOpenLoad(!openLoad);
    }
  };

  const handleOpenMenu = () => {
    setOpenMenu(!openMenu);
    setIsConfirmOpen(true);
    setIsVisible(true);
    dispatch(setIsLoaded(false));
    dispatch(setIsSaved(false));
  };

  return (
    <>
      <div className="flex flex-row-reverse fixed top-0 right-[10px] z-[40]">
        <button
          className="image-menu-btn relative mt-[5px] ml-[5px]"
          onClick={() => handleOpenMenu()}
        >
          {!openMenu ? (
            <Hamburger className="image-menu-option p-1.5" />
          ) : (
            <Close className="image-menu-option" />
          )}
        </button>
        {openMenu && (
          <>
            <button
              onClick={() => handleActions("load")}
              className="block bg-orange-500 text-white font-bold py-2 px-4 rounded hover:bg-orange-600 flex-1"
            >
              Load
            </button>
            <button
              onClick={() => handleActions("save")}
              className={`block mx-[5px] ${
                images.length <= 0
                  ? `bg-rose-100`
                  : `bg-rose-500 hover:bg-rose-600`
              } text-white font-bold py-2 px-4 rounded flex-1`}
              disabled={images.length <= 0}
            >
              Save
            </button>
            <button
              onClick={() => dispatch(setOpenUploadModal(true))}
              className="block bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded flex-1"
            >
              {buttonText}
            </button>
          </>
        )}
      </div>
      {(openLoad || openSave) && (
        <>
          <div
            className="fixed inset-0 bg-white bg-opacity-90 z-40"
            onClick={() => closeModal()}
          ></div>
        </>
      )}
      {openLoad && <LoadImageModal setOpenLoad={setOpenLoad} />}
      {openSave && <SaveImageModal setOpenSave={setOpenSave} />}
    </>
  );
};

export default imageActionsMenu;
