"use client";
import React from "react";
import WrapperLayout from "@/components/layouts/WrapperLayout";
import EditProfileDetails from "@/components/profile/EditProfileDetails";
import BackButton from "@/components/BackButton";
import { useUserQuery } from "@/hooks/queries/useUserQuery";
import { Skeleton } from "@/components/ui/skeleton";

function page() {
  const { data: userData, isLoading, error } = useUserQuery();
  console.log(userData);
  if (isLoading) {
    <Skeleton className="w-[100px] h-[20px] rounded-full" />;
  }
  return (
    <>
      <WrapperLayout>
        <BackButton />
        <EditProfileDetails userData={userData} />
      </WrapperLayout>
    </>
  );
}
export default page;
