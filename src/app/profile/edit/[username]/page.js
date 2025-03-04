"use client";
import React from "react";
import WrapperLayout from "@/components/layouts/WrapperLayout";
import EditProfileDetails from "@/components/profile/EditProfileDetails";
import BackButton from "@/components/BackButton";
import { useUserQuery } from "@/hooks/queries/useUserQuery";
import { useToast } from "@/hooks/use-toast";
import EditProfileSkeleton from "@/components/skeleton/Profile/EditProfileSkeleton";

function Page() {
  const { data: userData, isLoading: loadingUser, error } = useUserQuery();
  const { toast } = useToast();

  if (error) {
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    });
  }
  return (
    <>
      <WrapperLayout>
        {loadingUser ? (
          <EditProfileSkeleton />
        ) : (
          <>
            <BackButton />
            <EditProfileDetails userData={userData} />
          </>
        )}
      </WrapperLayout>
    </>
  );
}
export default Page;
