import React from "react";
import Image from "next/image";
import { gradientStyle } from "@/lib/utils/randomGradientGenerator";

const Banner = ({ userData }) => {
  return (
    <header className="banner relative w-full h-[150px]">
      {userData?.bannerImage ? (
        <Image
          src={
            userData?.tempBannerImage
              ? userData?.tempBannerImage
              : userData?.bannerImage?.imageUrl
          }
          alt="banner image"
          className="object-cover rounded-t-lg"
          loading="lazy"
          fill
          sizes="100vw"
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
