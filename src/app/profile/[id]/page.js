"use client";
import WrapperLayout from "@/components/layouts/WrapperLayout";
import ProfileDetails from "@/components/profile/ProfileDetails";
import React, { useEffect, useState } from "react";

function page({ params }) {
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    const getId = async () => {
      const { id } = await params;
      setUserId(id);
    };
    getId();
  }, [params]);
  return (
    <WrapperLayout>
      <ProfileDetails />
    </WrapperLayout>
  );
}

export default page;
