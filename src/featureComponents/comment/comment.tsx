import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../app/store";
import {
  updateImageInfo,
  updatePreviewImageInfo,
} from "../uploadImage/uploadImageSlice";
import Edit from "../../resource/images/edit.svg";
import { ImageInfo } from "../uploadImage/uploadImageSlice";

interface CommentProps {
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

const comment: React.FC<CommentProps> = ({ image, imageStyle }) => {
  const [inputText, setInputText] = useState(image.comment || "");
  const dispatch = useDispatch<AppDispatch>();

  const handleUpdateImageInfo = (field: keyof ImageInfo) => {
    const toBeUpdated = { ...image }; // Copy the existing image properties

    switch (field) {
      case "comment":
        toBeUpdated.comment = inputText; // Update the comment field with inputText
        toBeUpdated.commentModal = !image.commentModal;
        toBeUpdated.editComment = image.editComment && false;
        break;
      case "commentModal":
        toBeUpdated.commentModal = !image.commentModal; // Toggle the commentModal field
        toBeUpdated.editComment = image.editComment && false;
        break;
      case "favorite":
        toBeUpdated.favorite = !image.favorite; // Example: toggle favorite
        break;
      case "editComment":
        toBeUpdated.editComment = !image.editComment; // Example: toggle favorite
        break;
      // Add more cases here as needed for other ImageInfo fields
      default:
        console.warn(`Unhandled field: ${field}`);
    }

    dispatch(
      imageStyle
        ? updateImageInfo(toBeUpdated)
        : updatePreviewImageInfo(toBeUpdated)
    );
  };

  return (
    <div
      className={`flex flex-col h-[20%] absolute bottom-0 z-40 w-full items-center ${
        image.commentModal && "bg-black bg-opacity-35"
      } ${image.commentModal && image.comment && "justify-center"}`}
    >
      {(image.commentModal && !image.comment) || image.editComment ? (
        <>
          <input
            type="text"
            className="w-11/12 outline-none px-[5px] py-[3px] rounded-[10px] absolute bottom-[40px]"
            maxLength={100}
            placeholder="Description of the image"
            autoFocus
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <div className="flex w-[86%] pt-[1px] pb-[8px] absolute bottom-0">
            <button
              className="block text-white rounded-[10px] flex-1 py-[1px] hover:text-black hover:bg-white hover:bg-opacity-70"
              onClick={() => handleUpdateImageInfo("commentModal")}
            >
              Cancel
            </button>
            <button
              className="block text-white rounded-[10px] flex-1 hover:text-black hover:bg-white hover:bg-opacity-70"
              onClick={() => handleUpdateImageInfo("comment")}
            >
              Comment
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="text-white">{image.comment}</div>
          <button
            className="block absolute flex-1 top-0 right-0"
            onClick={() => handleUpdateImageInfo("editComment")}
          >
            <Edit className="image-menu-option p-1.5" />
          </button>
        </>
      )}
    </div>
  );
};

export default comment;
