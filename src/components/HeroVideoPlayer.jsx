"use client";
import React, { useState } from "react";

function HeroVideoPlayer() {
  return (
    <div className="video-container">
      <div
        style={{
          padding: "56.25% 0 0 0",
          position: "relative",
        }}
      >
        <iframe
          src="https://player.vimeo.com/video/1065363203?h=3f2d8c85d9&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
          className="absolute top-0 left-0 w-full h-full rounded-lg "
          title="JourneySkill: Build Consistency, Master Coding Challenges"
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
}

export default HeroVideoPlayer;
