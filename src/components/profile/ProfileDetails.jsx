import React, { useState } from "react";
import ProfileTab from "./profileTab/ProfileTab";
import { gradientStyle } from "@/lib/utils/randomGradientGenerator";
import Banner from "./ProfileBanner";
import ProfileHeader from "./ProfileHeader";
import Stats from "./UserStats";
import Bio from "./ProfileBio";

// All code in this file is from the profile page
function ProfileDetails({ userData }) {
  const [showMore, setShowMore] = useState(false);
  const handleShowMore = () => {
    setShowMore(!showMore);
  };
  return (
    <section className="mt-5 px-2 lg:px-0">
      <Banner userData={userData} />
      <ProfileHeader userData={userData} />
      <Stats
        followerCount={userData?.followerCount}
        followingCount={userData?.followingCount}
      />
      <Bio
        bioText={userData?.bio}
        location={userData?.location}
        showMore={showMore}
        toggleShowMore={handleShowMore}
      />
      <div className="mt-8">
        <ProfileTab userData={userData} />
      </div>
    </section>
  );
}

export default ProfileDetails;
