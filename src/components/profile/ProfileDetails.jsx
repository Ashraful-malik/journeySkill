import React, { useState } from "react";
import ProfileTab from "./profileTab/ProfileTab";
import Banner from "./ProfileBanner";
import ProfileHeader from "./ProfileHeader";
import Stats from "./UserStats";
import Bio from "./ProfileBio";
import BackButton from "../BackButton";
import { UserStatsProvider } from "@/context/UserStatsContext";

// All code in this file is from the profile page
function ProfileDetails({ userData }) {
  const [showMore, setShowMore] = useState(false);
  const handleShowMore = () => {
    setShowMore(!showMore);
  };
  return (
    <UserStatsProvider userId={userData?._id}>
      <BackButton />
      <section className="mt-5 px-2 lg:px-0">
        <Banner userData={userData} />
        <ProfileHeader userData={userData} />
        <Stats />
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
    </UserStatsProvider>
  );
}

export default ProfileDetails;
