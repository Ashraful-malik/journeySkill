"use client";
import { useUser } from "@clerk/nextjs";
import { createContext, useContext } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { user } = useUser();
  const filteredUser = user
    ? {
        id: user.id,
        email: user.primaryEmailAddress?.emailAddress,
        publicMetadata: user.publicMetadata,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
      }
    : null;

  return (
    <UserContext.Provider value={{ user: filteredUser }}>
      {children}
    </UserContext.Provider>
  );
};
export const useGlobalUser = () => useContext(UserContext);
