import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ApiProvider } from "./contexts/ApiContext";
import { WalletProvider } from "./contexts/WalletContext";

const withProviders = (Component: React.ComponentType) => (props: any) => (
  <BrowserRouter>
    <ApiProvider>
      <WalletProvider>
        <Component {...props} />
      </WalletProvider>
    </ApiProvider>
  </BrowserRouter>
);

export default withProviders;
