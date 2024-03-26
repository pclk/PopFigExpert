"use client";

import { HistoryProvider } from "@/context/HistoryContext";
import { MessagesProvider } from "@/context/MessageContext";
import { ColorSchemeScript, MantineProvider, createTheme } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { FC } from "react";

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
          <MessagesProvider>
            <QueryClientProvider client={queryClient}>
              {children}
            </QueryClientProvider>
          </MessagesProvider>
        </HistoryProvider>
      </MantineProvider>
    </>
  );
};

export default Providers;