import { configureStore, isPlain } from "@reduxjs/toolkit";
import uploadImageReducer from "../featureComponents/uploadImage/uploadImageSlice";

const store = configureStore({
  reducer: {
    imageContainer: uploadImageReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        isSerializable: (value: any) => {
          // Custom check: allow File, Blob, or other objects
          if (value instanceof File || value instanceof Blob) return true;
          return isPlain(value);
        },
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
