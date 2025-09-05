import React from "react";
import Loader from "./Loader";

const LoadingAPI = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[50vh]">
      <Loader size="lg" />
      <div className="text-center p-4 mt-4">Loading API...</div>
    </div>
  );
};

export default LoadingAPI;
