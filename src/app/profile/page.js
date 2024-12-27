"use client";
import WrapperLayout from "@/components/layouts/WrapperLayout";
import ProfileDetails from "@/components/profile/ProfileDetails";
import React from "react";

function page() {
  return (
    <WrapperLayout>
      <ProfileDetails />
    </WrapperLayout>
  );
}

export default page;
