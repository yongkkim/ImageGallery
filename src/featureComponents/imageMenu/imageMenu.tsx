import React, { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../app/store";
import {
  deleteImages,
  deletePreviewImages,
  updateImageInfo,
  updatePreviewImageInfo,
} from "../selectAndLoadImage/selectAndLoadImageSlice";
import Favorite from "../../resource/images/heart_emtpy.svg";
import FavoriteFill from "../../resource/images/heart_fill.svg";
import Comment from "../../resource/images/comment.svg";
import Cancel from "../../resource/images/cancelButton.svg";
import { ImageInfo } from "../selectAndLoadImage/selectAndLoadImageSlice";

interface ImageMenuProps {
  image: {
    blob: File;
    name: string;
    favorite: boolean;
    comment: string;
    commentModal: boolean;
    editComment: boolean;
  };
  imageStyle?: string;
}

const imageMenu: React.FC<ImageMenuProps> = ({ imageStyle, image }) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleUpdateImageInfo = (field: keyof ImageInfo) => {
    const toBeUpdated = {
      ...image, // Spread the existing image properties
      [field]: !image[field],
    };

    dispatch(
      imageStyle
        ? updateImageInfo(toBeUpdated)
        : updatePreviewImageInfo(toBeUpdated)
    );
  };

  const handleDelete = () => {
    dispatch(imageStyle ? deleteImages(image) : deletePreviewImages(image));
  };

  const tooltip = (alt: string) => {
    return (
      <span
        className="tooltip-text hidden absolute w-fit left-[100%] ml-2
        mb-2 bg-teal-500 text-white text-center rounded px-2 py-1 opacity-0 group-hover:block group-hover:opacity-100 group-hover:transition-opacity group-hover:duration-1000 group-hover:whitespace-normal"
      >
        {alt}
      </span>
    );
  };

  return (
    <div className="absolute top-[10px] left-[10px] flex flex-col z-30">
      <button
        className="image-menu-btn group relative mt-[5px]"
        onClick={() => handleUpdateImageInfo("favorite")}
      >
        {image.favorite ? (
          <FavoriteFill className="image-menu-option p-1.5 group-hover:stroke-[8px]" />
        ) : (
          <Favorite className="image-menu-option p-1.5 group-hover:stroke-[8px]" />
        )}
        {tooltip("Favorite")}
      </button>
      <button
        className={`image-menu-btn group relative mt-[5px] ${
          image.comment && "bg-[rgb(252,104,125)]"
        }`}
        onClick={() => handleUpdateImageInfo("commentModal")}
      >
        <Comment
          className={`image-menu-option fill-current ${
            image.comment ? "text-black" : "text-[rgb(251,113,133)]"
          } group-hover:text-[rgb(252,104,125)]`}
        />
        {tooltip("Comment")}
      </button>
      <button
        className="image-menu-btn group relative mt-[5px]"
        onClick={() => handleDelete()}
      >
        <Cancel className="image-menu-option fill-current text-[rgb(82,82,82)] group-hover:text-[rgb(0,0,0)]" />
        {tooltip("Remove")}
      </button>
    </div>
  );
};

export default imageMenu;
