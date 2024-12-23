import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../app/store";
import {
  fetchImages,
  fetchGallery,
  setIsLoaded,
  incrementRequestCount,
  setGalleryName,
} from "../uploadImage/uploadImageSlice";
import Gallery from "../gallery/gallery";
import Loading from "../sharedComponents/loading/loading";
import { debounce } from "lodash";
import store from "../../app/store";

type loadImageModalProps = {
  setOpenLoad: React.Dispatch<React.SetStateAction<boolean>>;
};

const loadImageModal: React.FC<loadImageModalProps> = ({ setOpenLoad }) => {
  const dispatch = useDispatch<AppDispatch>();
  const galleries = useSelector(
    (state: RootState) => state.imageContainer.galleryList
  );
  const isGalleryImagesLoading = useSelector(
    (state: RootState) => state.imageContainer.isGalleryImagesLoading
  );
  const fetchImagesInfo = async () => {
    dispatch(fetchGallery());
  };

  const handleFetchImages = async (galleryName: string) => {
    dispatch(fetchImages({ galleryName, requestCount: 1 }))
      .then((action) => {
        if (action.type.endsWith("/fulfilled")) {
          setOpenLoad(false);
          setIsLoaded(true);
          <Gallery />;
        }
      })
      .catch((error) => {
        console.error("Action failed:", error);
      });
  };

  // Fetch next page when scrolling to the bottom
  const handleScroll = debounce(async () => {
    const state = store.getState();
    const requestCount = state.imageContainer.requestCount;
    const galleryName = state.imageContainer.galleryName;
    const allImagesFetched = state.imageContainer.allImagesFetched;
    const isGalleryImagesLoading = state.imageContainer.isGalleryImagesLoading;

    if (
      !allImagesFetched &&
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 50 &&
      !isGalleryImagesLoading
    ) {
      dispatch(
        fetchImages({
          galleryName,
          requestCount,
        })
      );
    }
  }, 300);

  useEffect(() => {
    fetchImagesInfo();
    window.addEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    console.log("isGalleryImagesLoading", isGalleryImagesLoading);
  }, [isGalleryImagesLoading]);

  return (
    <div className="flex flex-col flex-wrap items-center justify-center fixed z-50 w-2/4 border-2 border-black rounded-[10px] top-[30%] left-[50%] -translate-x-2/4">
      {isGalleryImagesLoading && (
        <div className="absolute rounded-[12px] inset-0 flex items-center justify-center bg-gray-100/80 z-50">
          <Loading />
        </div>
      )}
      <h1 className="mb-[20px] py-[10px] text-[20px] font-bold text-white text-center w-full border-b-[3px] border-black bg-teal-600 rounded-t-[8px]">
        Select one of the galleries
      </h1>
      <ul
        className={`w-11/12 h-[${
          galleries.length <= 0 ? "50px" : "200px"
        }] text-center overflow-y-auto custom-scrollbar mb-[10px]`}
      >
        {galleries.length <= 0 && <span>There is no saved gallery</span>}
        {galleries.map((gallery, index) => (
          <li
            key={index + "_gallelry"}
            className="py-[5px] hover:bg-gray-400 hover:text-white cursor-pointer"
            onClick={() => handleFetchImages(gallery)}
          >
            {gallery}
          </li>
        ))}
      </ul>
      <div className="flex w-[86%] pt-[5px] pb-[8px] border-t-2 border-black">
        <button
          onClick={() => setOpenLoad(false)}
          className="block rounded-[10px] flex-1 py-[1px] hover:text-white hover:bg-black hover:bg-opacity-60"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default loadImageModal;
