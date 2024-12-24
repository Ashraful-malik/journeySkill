import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";

function page() {
  return (
    <div className="h-screen ">
      <SidebarProvider className="h-full">
        <AppSidebar />
        <div className="p-4">
          <p>this is the home page</p>
        </div>
      </SidebarProvider>
      <div></div>
    </div>
  );
}

export default page;
