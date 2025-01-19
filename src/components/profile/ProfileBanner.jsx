import React from "react";
import Image from "next/image";
import { gradientStyle } from "@/lib/utils/randomGradientGenerator";

const Banner = ({ userData }) => {
  return (
    <header className="banner">
      {userData?.bannerImage ? (
        <Image
          src={
            userData?.tempBannerImage
              ? userData?.tempBannerImage
              : userData?.bannerImage?.imageUrl
          }
          alt="banner image"
          className="w-full h-[150px] object-cover rounded-t-lg"
          loading="lazy"
          width={800}
          height={150}
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
