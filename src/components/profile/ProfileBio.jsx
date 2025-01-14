import { MapPin } from "lucide-react";
import React from "react";

const Bio = ({ bioText, showMore, toggleShowMore, location }) => (
  <>
    <div className="profile-bio pt-4">
      <p
        className={`text-sm text-muted-foreground max-w-[65ch] ${
          showMore ? "" : "line-clamp-2"
        }`}
        id="bio"
      >
        {bioText}
      </p>
      {bioText?.length > 200 && (
        <button
          className="text-sm font-bold cursor-pointer"
          aria-expanded={showMore}
          aria-controls="bio"
          onClick={toggleShowMore}
        >
          {showMore ? "Show less" : "Show more"}
        </button>
      )}
    </div>

    <div className="location">
      <p className="text-sm text-muted-foreground flex items-center ">
        <MapPin size={16} className="mr-2" />
        <span className="font-bold">{location}</span>
      </p>
    </div>
  </>
);

export default Bio;
