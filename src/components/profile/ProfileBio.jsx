import React from "react";

const Bio = ({ bioText, showMore, toggleShowMore }) => (
  <div className="profile-bio py-4">
    <p
      className={`text-sm text-muted-foreground max-w-[65ch] ${
        showMore ? "" : "line-clamp-2"
      }`}
      id="bio"
    >
      {bioText}
    </p>
    <button
      className="text-sm font-bold cursor-pointer"
      aria-expanded={showMore}
      aria-controls="bio"
      onClick={toggleShowMore}
    >
      {showMore ? "Show less" : "Show more"}
    </button>
  </div>
);

export default Bio;
