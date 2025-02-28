"use client";
import WrapperLayout from "@/components/layouts/WrapperLayout";
import ProfileDetails from "@/components/profile/ProfileDetails";
import ProfileDetailsSkeleton from "@/components/skeleton/Profile/ProfileDetailsSkeleton";
import { useUserProfileQuery } from "@/hooks/queries/useUserQuery";
import { useParams } from "next/navigation";
import React from "react";

function Page() {
  const params = useParams();
  const username = params?.username;
  // get user profile data
  const { data, isLoading } = useUserProfileQuery(username);
  return (
    <WrapperLayout>
      {isLoading ? (
        <div>
          <ProfileDetailsSkeleton />
        </div>
      ) : (
        <ProfileDetails userData={data} />
      )}
    </WrapperLayout>
  );
}

export default Page;
