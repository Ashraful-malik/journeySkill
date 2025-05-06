"use client";
import React, { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import HomeNavbar from "@/components/navbar/HomeNavbar";
import BottomNav from "../sidebar/BottomNav";

const WrapperLayout = ({ children, className }) => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  return (
    <div
      className={`${className} flex flex-col lg:flex-row max-w-5xl mx-auto  mb-20`}
    >
      {/* Sidebar for desktop */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      {/* Sidebar for mobile */}
      {isSidebarVisible && (
        <div
          className="fixed inset-0 z-50"
          onClick={() => setSidebarVisible(false)}
        >
          <div
            className="absolute top-0 left-0 w-64 h-full shadow-md"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar />
          </div>
        </div>
      )}
      {/* Navbar for mobile */}
      <div className="lg:hidden">
        <HomeNavbar onHamburgerClick={toggleSidebar} />
      </div>
      {/* Main Content */}
      <div className="lg:ml-64 w-full  p-2">{children}</div>
      {/* Bottom Navigation for mobile */}
      <BottomNav />
    </div>
  );
};

export default WrapperLayout;
