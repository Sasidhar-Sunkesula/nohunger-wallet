"use client";

import appStore from "@repo/store/appStore";
import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <Provider store={appStore}>{children}</Provider>
    </SessionProvider>
  );
};
