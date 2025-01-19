"use client";
import WrapperLayout from "@/components/layouts/WrapperLayout";
import ProfileDetails from "@/components/profile/ProfileDetails";
import { useUserQuery } from "@/hooks/queries/useUserQuery";
import React, { useEffect, useState } from "react";

function page({ params }) {
  const { data: userData, isLoading, error } = useUserQuery();
  // Fetch user data based on the username

  return (
    <WrapperLayout>
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      <ProfileDetails userData={userData} />
    </WrapperLayout>
  );
}

export default page;
