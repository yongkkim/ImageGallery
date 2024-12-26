import React, { useEffect, useRef, useState } from "react";
import Comment from "../../comment/comment";
import { deletePreviewImages } from "../../selectAndLoadImage/selectAndLoadImageSlice";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../app/store";
import ImageMenu from "../../imageMenu/imageMenu";

interface ImageProps {
  image: {
    blob: File;
    name: string;
    favorite: boolean;
    comment: string;
    commentModal: boolean;
    editComment: boolean;
  };
  imageStyle?: string;
  handleImageLoad?: () => void;
}

const image: React.FC<ImageProps> = ({
  image,
  imageStyle,
  handleImageLoad,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [mouseEnter, setMouseEnter] = useState(false);
  const [imageSrc, setImageSrc] = useState("");

  const handleMouseEnter = () => {
    setMouseEnter(true);
  };
  const handleMouseLeave = () => {
    setMouseEnter(false);
  };

  useEffect(() => {
    if (image.blob instanceof File) {
      const objectUrl = URL.createObjectURL(image.blob);
      setImageSrc(objectUrl);
      // Clean up the object URL when the component unmounts or the file changes
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    } else {
      console.error("Invalid input for createObjectURL", image);
    }
  }, [image.blob]);

  return (
    <div
      className={`relative rounded-3xl ${
        imageStyle === "grid" ? "grid-item w-full h-auto" : "flex max-h-[300px]"
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {image.favorite && (
        <div className="absolute text-center top-[10px] right-0 py-[2px] rounded-l-full text-white tracking-[0.5px] leading-[34px] font-bold bg-red-600/[10] z-30 w-[33%] h-fit">
          Favorite
        </div>
      )}
      <img
        src={imageSrc}
        className={`${!imageStyle && "w-full h-auto"}`}
        onLoad={handleImageLoad}
      />
      {mouseEnter &&
        (!imageStyle ? (
          <div
            onClick={() => dispatch(deletePreviewImages(image))}
            className="absolute flex justify-center items-center text-white inset-0 bg-black bg-opacity-25 z-20 hover:cursor-pointer"
          >
            Click to remove
          </div>
        ) : (
          <>
            <div className="absolute inset-0 bg-black bg-opacity-25 z-20"></div>
            <ImageMenu imageStyle={imageStyle} image={image} />
          </>
        ))}
      {image.commentModal && <Comment imageStyle={imageStyle} image={image} />}
    </div>
  );
};

export default image;
