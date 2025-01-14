import React from "react";
import { gradientStyle } from "@/lib/utils/randomGradientGenerator";
import { Button } from "../ui/button";
import { Camera, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import EditUserUserData from "./Edit/EditUserData";
import UpdateProfileImage from "../fileUpload/UpdateProfileImage";
function EditProfileDetails({ userData }) {
  const imageUrl = "";
  const updateProfileImage = () => {
    console.log("update profile image");
  };
  return (
    <>
      <div className="mt-4 p-2 lg:p-0">
        {/*Edit Profile banner */}
        <section className="relative">
          {/* banner edit overlays button */}
          <div className="absolute top-0 right-0 bg-black/30 w-full h-full"></div>

          {/* banner edit button */}
          <div className=" absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Button variant="ghost" size="sm">
              <Camera /> <span>Change Banner</span>
            </Button>
          </div>

          {userData?.bannerImage ? (
            <Image
              src={imageUrl}
              alt="banner image"
              className="w-full h-[150px] object-cover rounded-lg"
              loading="lazy"
            />
          ) : (
            <div
              className={`w-full h-[150px] rounded-lg `}
              style={gradientStyle}
            ></div>
          )}
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
