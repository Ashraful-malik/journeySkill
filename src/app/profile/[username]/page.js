"use client";
import WrapperLayout from "@/components/layouts/WrapperLayout";
import ProfileDetails from "@/components/profile/ProfileDetails";
import ProfileDetailsSkeleton from "@/components/skeleton/Profile/ProfileDetailsSkeleton";
import { useUserQuery } from "@/hooks/queries/useUserQuery";
import React, { useEffect, useState } from "react";

function page() {
  const { data: userData, isLoading, error } = useUserQuery();
  // Fetch user data based on the username

  return (
    <WrapperLayout>
      {isLoading ? (
        <div>
          <ProfileDetailsSkeleton />
        </div>
      ) : (
        <ProfileDetails userData={userData} />
      )}
    </WrapperLayout>
  );
}

export default page;
