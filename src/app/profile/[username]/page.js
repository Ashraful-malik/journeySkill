"use client";
import WrapperLayout from "@/components/layouts/WrapperLayout";
import ProfileDetails from "@/components/profile/ProfileDetails";
import { useUserQuery } from "@/hooks/queries/useUserQuery";
import React, { useEffect, useState } from "react";

function page({ params }) {
  // username from params
  const [username, setUsername] = useState(null);
  const { data: userData, isLoading, error } = useUserQuery();
  // Fetch user data based on the username
  useEffect(() => {
    const getId = async () => {
      const { username } = await params;
      setUsername(username);
    };
    getId();
  }, [params]);
  return (
    <WrapperLayout>
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      <ProfileDetails userData={userData?.data} />
    </WrapperLayout>
  );
}

export default page;
