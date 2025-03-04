"use client";
import React from "react";
import { ChevronLeft } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

function BackButton() {
  const router = useRouter();
  const back = () => {
    router.back();
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="rounded-lg mt-4 ml-2 lg:ml-0"
      onClick={back}
    >
      <ChevronLeft />
      Back
    </Button>
  );
}

export default BackButton;
