import { PropsWithChildren } from "react";
import { AuthProvider } from "../contexts/auth-provider";
import { ReactQueryClientProvider } from "../hooks/react-query-client-provider";

export const Providers = ({ children }: PropsWithChildren) => {
  return (
    <ReactQueryClientProvider>
      <AuthProvider>{children}</AuthProvider>
    </ReactQueryClientProvider>
  );
};
