"use client";
import { useUser } from "@clerk/nextjs";
import { createContext, useContext } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { user } = useUser();
  console.log(user);
  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
};
export const useGlobalUser = () => useContext(UserContext);
