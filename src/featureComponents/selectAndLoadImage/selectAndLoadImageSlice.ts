import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface ImageInfo {
  name: string;
  blob: File;
  favorite: boolean;
  comment: string;
  commentModal: boolean;
  editComment: boolean;
}

interface ImageContainer {
  images: Array<ImageInfo>;
  previewImages: Array<ImageInfo>;
  openUploadModal: boolean;
  favorite: boolean;
  comment: string;
  commentModal: boolean;
  editComment: boolean;
  galleryList: Array<string>;
  isGalleryLoading: boolean;
  isPreviewLoading: boolean;
  isGalleryImagesLoading: boolean;
  isSaveProcessing: boolean;
  isLoaded: boolean;
  isSaved: boolean;
  requestCount: number;
  galleryName: string;
  allImagesFetched: boolean;
}

const initialState: ImageContainer = {
  images: [],
  previewImages: [],
  openUploadModal: false,
  favorite: false,
  comment: "",
  commentModal: false,
  editComment: false,
  galleryList: [],
  isGalleryLoading: false,
  isPreviewLoading: false,
  isGalleryImagesLoading: false,
  isSaveProcessing: false,
  isLoaded: false,
  isSaved: false,
  requestCount: 1,
  galleryName: "",
  allImagesFetched: false,
};

export const uploadImages = createAsyncThunk(
  "images/uploadImages",
  async (
    { images, galleryName }: { images: any[]; galleryName: string },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      // Append galleryName to the form data
      formData.append("galleryName", galleryName);

      // Append each file to the form data
      images.forEach((image, index) => {
        formData.append(`images[${index}][blob]`, image.blob);
        formData.append(
          `images[${index}][favorite]`,
          image.favorite.toString()
        );
        formData.append(`images[${index}][comment]`, image.comment);
      });

      // Send the POST request
      const response = await axios.post(
        "http://localhost:5000/images",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data; // Return the response data to be handled by reducers
    } catch (error: any) {
      // Return a rejected value to be handled in extraReducers
      return rejectWithValue(error.response?.data || "Failed to upload images");
    }
  }
);

export const fetchGallery = createAsyncThunk(
  "galleries/fetchGallery",
  async () => {
    const response = await axios.get("http://localhost:5000/images/galleries");
    return response.data.map(
      (gallery: { GalleryName: string }) => gallery.GalleryName
    );
  }
);

export const fetchImages = createAsyncThunk(
  "images/fetchImages",
  async (
    {
      galleryName,
      requestCount,
    }: { galleryName: string; requestCount: number },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      // Append galleryName to the form data
      formData.append("galleryName", galleryName);
      const response = await axios.get("http://localhost:5000/images", {
        params: { galleryName, requestCount }, // Add the galleryName as a query parameter
        responseType: "json",
      });

      return {
        images: response.data,
        galleryName,
      };
    } catch (error: any) {
      // Return a rejected value to be handled in extraReducers
      return rejectWithValue(error.response?.data || "Failed to upload images");
    }
  }
);

const uploadImageSlice = createSlice({
  name: "uploadImage",
  initialState,
  reducers: {
    saveImages: (state, action: PayloadAction<ImageInfo[]>) => {
      state.images = [...state.images, ...action.payload];
    },
    updateImageInfo: (state, action: PayloadAction<Partial<ImageInfo>>) => {
      state.images = state.images.map((img) =>
        img.name === action.payload.name
          ? { ...img, ...action.payload } // Create a new object with the updated favorite value
          : img
      );
    },
    deleteImages: (
      state,
      action: PayloadAction<{ blob: File; name: string; favorite: boolean }>
    ) => {
      state.images = state.images.filter(
        (image) => image.name !== action.payload.name
      );
    },
    setPreviewImages: (
      state,
      action: PayloadAction<ImageInfo | ImageInfo[]>
    ) => {
      if (Array.isArray(action.payload)) {
        state.previewImages = [...state.previewImages, ...action.payload];
      } else {
        state.previewImages.push(action.payload);
      }
    },
    updatePreviewImageInfo: (
      state,
      action: PayloadAction<Partial<ImageInfo>>
    ) => {
      state.previewImages = state.previewImages.map((img) =>
        img.name === action.payload.name
          ? { ...img, ...action.payload } // Create a new object with the updated favorite value
          : img
      );
    },
    deletePreviewImages: (
      state,
      action: PayloadAction<{ blob: File; name: string; favorite: boolean }>
    ) => {
      state.previewImages = state.previewImages.filter(
        (image) => image.name !== action.payload.name
      );
    },
    resetPreviewImages: (state) => {
      state.previewImages = [];
    },
    resetImages: (state) => {
      state.images = [];
    },
    setOpenUploadModal: (state, action: PayloadAction<boolean>) => {
      state.openUploadModal = action.payload;
    },
    setIsGalleryLoading: (state, action: PayloadAction<boolean>) => {
      state.isGalleryLoading = action.payload;
    },
    setIsPreviewLoading: (state, action: PayloadAction<boolean>) => {
      state.isPreviewLoading = action.payload;
    },
    setIsGalleryImagesLoading: (state, action: PayloadAction<boolean>) => {
      state.isGalleryImagesLoading = action.payload;
    },
    setIsSaveProcessing: (state, action: PayloadAction<boolean>) => {
      state.isSaveProcessing = action.payload;
    },
    setIsLoaded: (state, action: PayloadAction<boolean>) => {
      state.isLoaded = action.payload;
    },
    setIsSaved: (state, action: PayloadAction<boolean>) => {
      state.isSaved = action.payload;
    },
    incrementRequestCount: (state) => {
      state.requestCount += 1;
      console.log(state.requestCount);
    },
    setGalleryName: (state, action: PayloadAction<string>) => {
      state.galleryName = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      //fetching galleries
      .addCase(fetchGallery.pending, (state) => {
        console.log("Fetching galleries...");
      })
      .addCase(fetchGallery.fulfilled, (state, action) => {
        state.galleryList = action.payload;
        console.log("Fetching galleries successfully");
      })
      .addCase(fetchGallery.rejected, (state) => {
        console.log("Failed to fetch galleries");
      })
      //fetching images
      .addCase(fetchImages.pending, (state) => {
        state.isGalleryImagesLoading = true;
        console.log("Fetching images...");
      })
      .addCase(fetchImages.fulfilled, (state, action) => {
        const fetchedImages = action.payload.images;
        if (fetchedImages.length === 0) {
          // No more images to fetch
          state.allImagesFetched = true;
        } else {
          const newImages = new Array<ImageInfo>();
          action.payload.images.map((image: any) => {
            const { name, blob } = image;
            const fileBlob = new Blob([new Uint8Array(blob.data)], {
              type: "image/jpeg",
            });
            const file = new File([fileBlob], name, { type: fileBlob.type });
            newImages.push({
              blob: file,
              comment: image.comment,
              favorite: image.favorite,
              name: file.name,
              commentModal: false,
              editComment: false,
            });
          });
          state.images = [...state.images, ...newImages];
          console.log("Fetching images successfully");
        }
        state.isLoaded = true;
        state.isGalleryImagesLoading = false;
        state.galleryName = action.payload.galleryName;
        state.requestCount += 1;
      })
      .addCase(fetchImages.rejected, (state) => {
        state.isGalleryImagesLoading = false;
        console.log("Failed to fetch galleries");
      })
      //uploading images
      .addCase(uploadImages.pending, (state) => {
        state.isSaveProcessing = true;
        console.log("Uploading image...");
      })
      .addCase(uploadImages.fulfilled, (state, action) => {
        state.isSaved = true;
        state.isSaveProcessing = false;
        console.log("Uploaded image successfully");
      })
      .addCase(uploadImages.rejected, (state) => {
        state.isSaveProcessing = false;
        console.log("Failed to upload image");
      });
  },
});

export const {
  saveImages,
  deleteImages,
  deletePreviewImages,
  setPreviewImages,
  resetPreviewImages,
  setOpenUploadModal,
  updateImageInfo,
  updatePreviewImageInfo,
  setIsGalleryLoading,
  setIsPreviewLoading,
  setIsGalleryImagesLoading,
  setIsSaveProcessing,
  setIsLoaded,
  setIsSaved,
  incrementRequestCount,
  setGalleryName,
  resetImages,
} = uploadImageSlice.actions;
export default uploadImageSlice.reducer;
