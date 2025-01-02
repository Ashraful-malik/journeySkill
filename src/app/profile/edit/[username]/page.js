import React from "react";
import WrapperLayout from "@/components/layouts/WrapperLayout";
import EditProfileDetails from "@/components/profile/EditProfileDetails";
import BackButton from "@/components/BackButton";

export default async function EditProfile({ params }) {
  const { username } = await params;
  return (
    <>
      <WrapperLayout>
        <BackButton />
        <EditProfileDetails />
      </WrapperLayout>
    </>
  );
}
