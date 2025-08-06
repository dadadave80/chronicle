"use client";
import React from "react";
import { CircleLoader } from "react-spinners";

const Preloader = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-[100dvh] z-[9999] bg-gray-200 flex justify-center items-center">
      <CircleLoader size={80} color="#000000E5" loading={true} />
    </div>
  );
};

export default Preloader;
