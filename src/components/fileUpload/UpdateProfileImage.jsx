import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Camera, CameraIcon, User } from "lucide-react";

function UpdateProfileImage({ userData }) {
  const handleFileChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }
  };
  return (
    <>
      <div class="relative w-24 h-24">
        {/* <div class="absolute inset-0 rounded-full bg-blue-500"></div> */}
        {/* <!-- Inner Content --> */}
        <div class="absolute inset-0 rounded-full  flex items-center justify-center">
          <div class="relative w-full h-full rounded-full overflow-hidden">
            {/* <!-- Image --> */}
            <img
              src="https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=76&q=80"
              alt="Profile"
              class="object-cover w-full h-full"
            />
          </div>
        </div>

        {/* <!-- Upload Icon --> */}
        <div class="absolute inset-0 flex items-center justify-center bg-black/45 rounded-full cursor-pointer">
          <CameraIcon className="text-slate-200 " />
        </div>

        {/* <!-- File Input --> */}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer "
        />
      </div>
    </>
  );
}

export default UpdateProfileImage;
// <Avatar className="w-20 h-20 ">
//   {/* avatar edit overlays */}
//   <div className="absolute top-0 right-0 bg-black/30 w-full h-full"></div>
//   <div className=" absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full">
//     <button
//       className=" h-full w-full flex items-center justify-center"
//       onClick={updateProfile}
//     >
//       <Camera />
//     </button>
//   </div>
//   <AvatarImage
//     src={
//       userData?.profileImage?.clerkImage || userData?.profileImage?.imageUrl
//     }
//     alt={userData?.username}
//   />
//   <AvatarFallback aria-label="User's initials">
//     <User />
//   </AvatarFallback>
// </Avatar>
