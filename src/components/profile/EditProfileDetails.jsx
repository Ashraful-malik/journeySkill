import React from "react";
import EditUserUserData from "./Edit/EditUserData";
import UpdateProfileImage from "../fileUpload/ProfileImageUpload";
import BannerImageUpload from "../fileUpload/BannerImageUpload";
import BackButton from "../BackButton";
function EditProfileDetails({ userData }) {
  return (
    <>
      <div className="mt-4 p-2 lg:p-0">
        {/* back button */}
        <BackButton />
        {/*Edit Profile banner */}
        <section className="relative">
          <BannerImageUpload userData={userData} />
        </section>
        {/* edit profile Image */}
        <section className="-mt-12 relative">
          <UpdateProfileImage userData={userData} />
        </section>

        {/* Edit user data form (ex: name, bio) */}
        <section className="mt-4">
          <EditUserUserData />
        </section>
      </div>
    </>
  );
}

export default EditProfileDetails;
