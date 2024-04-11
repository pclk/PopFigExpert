"use client";

import { HistoryProvider } from "@/context/HistoryContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { FC } from "react";

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers: FC<ProvidersProps> = ({ children }) => {
  const queryClient = new QueryClient();
  return (
    <>
      <HistoryProvider>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </HistoryProvider>
    </>
  );
};

export default Providers;
