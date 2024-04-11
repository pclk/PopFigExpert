"use client";

import { HistoryProvider } from "@/context/HistoryContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { FC } from "react";

// import { AI } from "@/app/actions";

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers: FC<ProvidersProps> = ({ children }) => {
  const queryClient = new QueryClient();
  return (
    <>
        <HistoryProvider>
          <QueryClientProvider client={queryClient}>
            {/* <AI> */}
              {children}
            {/* </AI> */}
          </QueryClientProvider>
        </HistoryProvider>
    </>
  );
};

export default Providers;
