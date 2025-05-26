import { UserRole, UserType } from "@/apiCalls/signup";
import React, { createContext, useContext, ReactNode } from "react";

type User = {
  id: string;
  type: UserType;
  role: UserRole;
  name: string;
  // Add other user properties as needed
};

type UserContextType = {
  user: User | null;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({
  children,
  user,
}: {
  children: ReactNode;
  user: User | null;
}) => {
  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
