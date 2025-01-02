import React from "react";
import { gradientStyle } from "@/lib/utils/randomGradientGenerator";
import { Button } from "../ui/button";
import { Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import EditUserUserData from "./Edit/EditUserData";
function EditProfileDetails() {
  const imageUrl = "";
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

          {imageUrl ? (
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
          <Avatar className="w-20 h-20 ">
            {/* avatar edit overlays */}
            <div className="absolute top-0 right-0 bg-black/30 w-full h-full"></div>
            <div className=" absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Button variant="icon" size="lg">
                <Camera />
              </Button>
            </div>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback aria-label="User's initials">SM</AvatarFallback>
          </Avatar>
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
