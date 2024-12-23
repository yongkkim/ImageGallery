import React, { useRef } from "react";

const loading = () => {
  return (
    <div className="absolute inset-0 flex justify-center items-center bg-gray-100/80 z-10">
      <div className="loader border-4 border-teal-500 border-t-transparent w-8 h-8 rounded-full animate-spin"></div>
    </div>
  );
};

export default loading;
