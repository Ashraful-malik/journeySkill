import React from "react";
import Image from "next/image";

function ClerkLoadingLoader() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-black ">
      <div className="overflow-hidden relative">
        {/* animation */}
        <div
          className="absolute w-20 h-20 bg-purple-600/40 animate-pulse left-1/2 top-1/2 transform 
                  -translate-x-1/2 -translate-y-1/2 rounded-sm"
        ></div>
        {/* logo */}
        <Image src="/logo.svg" alt="loading" width={80} height={80} priority />
      </div>
    </div>
  );
}

export default ClerkLoadingLoader;
