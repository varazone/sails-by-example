import React from "react";
import { HashRouter } from "react-router-dom";
import { ApiProvider } from "./contexts/ApiContext";
import { WalletProvider } from "./contexts/WalletContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 0,
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

type Props = {
  children: ReactNode;
};

const QueryProvider = ({ children }: Props) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const withProviders = (Component: React.ComponentType) => (props: any) => (
  <HashRouter>
    <QueryProvider>
      <ApiProvider>
        <WalletProvider>
          <Component {...props} />
        </WalletProvider>
      </ApiProvider>
    </QueryProvider>
  </HashRouter>
);

export default withProviders;
