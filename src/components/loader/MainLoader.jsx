import React from "react";
import { PuffLoader } from "react-spinners";

const MainLoader = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <PuffLoader color="#FF9E01" size={80} />
    </div>
  );
};

export default MainLoader;
