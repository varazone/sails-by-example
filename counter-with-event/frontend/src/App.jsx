import React, { useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Sails } from "sails-js";
import { SailsIdlParser } from "sails-js-parser";
import { ApiProvider, useApi } from "./contexts/ApiContext";
import { useWallet, WalletProvider } from "./contexts/WalletContext";
import NetworkStatus from "./components/NetworkStatus";
import SailsProgram from "./components/SailsProgram";
import StickyNavbar from "./components/StickyNavbar";
import Sidebar from "./components/Sidebar";
import Loader from "./components/Loader";
import Center from "./components/Center";
import { IDL, PROGRAM_ID } from "./lib/counter";
import PendingPayouts from "./components/PendingPayouts";

import "./App.css";

const AppContent = () => {
  const { api } = useApi();
  const { selectedAccount } = useWallet();
  const [sails, setSails] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    if (api) {
      (async () => {
        const parser = await SailsIdlParser.new();
        const sails = new Sails(parser);
        sails.parseIdl(IDL);
        sails.setProgramId(PROGRAM_ID);
        sails.setApi(api);
        setSails(sails);
      })();
    }
  }, [api]);

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="p-4 h-16 sticky navbar top-0 z-50 glass">
        <StickyNavbar toggleSidebar={toggleSidebar} />
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </nav>

      <main className="flex-grow -mt-16 pt-16 shadow-none h-full">
        {api
          ? (
            <div className="bg-base-100">
              <div className="card-body">
                <NetworkStatus />
              </div>
              {sails &&
                (
                  <div className="card-body">
                    <SailsProgram sails={sails} />
                  </div>
                )}
            </div>
          )
          : (
            <div className="flex items-center justify-center h-[50vh]">
              <Loader size="lg" />
            </div>
          )}
        <div className="bg-base-100">
          <PendingPayouts />
        </div>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <ApiProvider>
        <WalletProvider>
          <AppContent />
        </WalletProvider>
      </ApiProvider>
    </Router>
  );
};

export default App;
