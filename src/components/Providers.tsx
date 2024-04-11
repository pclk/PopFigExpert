"use client";

import { HistoryProvider } from "@/context/HistoryContext";
import { ColorSchemeScript, MantineProvider, createTheme } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { FC } from "react";

import { AI } from "@/app/actions";

interface ProvidersProps {
  children: React.ReactNode;
}

const theme = createTheme({
  primaryColor: "teal",
  primaryShade: 4,
  fontFamily: 'Inter, "Helvetica Neue", sans-serif',
});

const Providers: FC<ProvidersProps> = ({ children }) => {
  const queryClient = new QueryClient();
  return (
    <>
      <MantineProvider theme={theme}>
        <ColorSchemeScript />
        <HistoryProvider>
          <QueryClientProvider client={queryClient}>
            <AI>{children}</AI>
          </QueryClientProvider>
        </HistoryProvider>
      </MantineProvider>
    </>
  );
};

export default Providers;
