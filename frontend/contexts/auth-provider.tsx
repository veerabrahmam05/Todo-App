"use client";
import { useContext, createContext, useState, PropsWithChildren } from "react";

type AuthRes = {
  accessToken: string;
  tokenType: string;
};

const AuthContext = createContext<{
  authHeader: AuthRes;
  setAuthHeader: (val: AuthRes) => void;
}>({
  authHeader: {
    accessToken: "",
    tokenType: "",
  },
  setAuthHeader: () => {},
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [authHeader, setAuthHeader] = useState<AuthRes>({
    accessToken: "",
    tokenType: "",
  });
  return (
    <AuthContext value={{ authHeader, setAuthHeader }}>{children}</AuthContext>
  );
};

export const useAuthHeader = () => useContext(AuthContext);
