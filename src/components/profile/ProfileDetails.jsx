import React, { useState } from "react";
import ProfileTab from "./profileTab/ProfileTab";
import { gradientStyle } from "@/lib/utils/randomGradientGenerator";
import Banner from "./ProfileBanner";
import ProfileHeader from "./ProfileHeader";
import Stats from "./UserStats";
import Bio from "./ProfileBio";

// All code in this file is from the profile page
function ProfileDetails() {
  const [showMore, setShowMore] = useState(false);
  const bioText = `I am a student at University of Delhi and I am passionate about
            technology. I love to explore new technologies and I am always
            learning new things. I am a student at University of Delhi and I am
            passionate about technology. I love to explore new technologies and
            I am always learning new things.`;

  const handleShowMore = () => {
    setShowMore(!showMore);
    console.log(gradientStyle);
  };
  return (
    <section className="mt-5 px-2 lg:px-0">
      <Banner />
      <ProfileHeader />
      <Stats />
      <Bio
        bioText={bioText}
        showMore={showMore}
        toggleShowMore={handleShowMore}
      />
      <div className="mt-8">
        <ProfileTab />
      </div>
    </section>
  );
}

export default ProfileDetails;
