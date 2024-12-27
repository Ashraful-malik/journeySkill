import React from "react";
import Image from "next/image";
import { gradientStyle } from "@/lib/utils/randomGradientGenerator";

const Banner = () => {
  const imageUrl = ""; // Replace with actual URL or state check.

  return (
    <header className="banner">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt="banner image"
          className="w-full h-[150px] object-cover rounded-t-lg"
          loading="lazy"
        />
      ) : (
        <div
          className={`w-full h-[150px] rounded-t-lg `}
          style={gradientStyle}
        ></div>
      )}
    </header>
  );
};

export default Banner;
