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
    console.log(gradientStyle);
  };
  return (
    <section className="mt-5 px-2 lg:px-0">
      <Banner />
      <ProfileHeader
        username={userData?.username}
        fullName={userData?.fullName}
        profileImage={userData?.profileImage}
      />
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
        <ProfileTab />
      </div>
    </section>
  );
}

export default ProfileDetails;
