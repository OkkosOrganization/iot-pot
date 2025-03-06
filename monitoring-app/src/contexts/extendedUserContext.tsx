"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { User } from "@/types";

type ExtendedUserType = {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
};

type ExtendedUserProviderProps = {
  children: ReactNode;
};

const ExtendedUserContext = createContext<ExtendedUserType | null>(null);

export const ExtendedUserProvider = ({
  children,
}: ExtendedUserProviderProps) => {
  const { user, isLoading } = useUser();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    if (user && user !== currentUser) {
      setCurrentUser(user as User);
    }
  }, [user, currentUser]);

  return (
    <ExtendedUserContext.Provider
      value={{
        user: currentUser,
        setUser: setCurrentUser,
        isLoading: isLoading,
      }}
    >
      {children}
    </ExtendedUserContext.Provider>
  );
};

export const useExtendedUserContext = (): ExtendedUserType => {
  const context = useContext(ExtendedUserContext);
  if (!context) {
    throw new Error(
      "useExtendedUserContext must be used within an ExtendedUserProvider"
    );
  }
  return context;
};
