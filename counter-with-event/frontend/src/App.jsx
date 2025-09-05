import React, { useState } from "react";
import { useApi } from "./contexts/ApiContext";
import { useWallet } from "./contexts/WalletContext";
import NetworkStatus from "./components/NetworkStatus";
import SailsProgram from "./components/SailsProgram";
import StickyNavbar from "./components/StickyNavbar";
import Sidebar from "./components/Sidebar";
import Loader from "./components/Loader";
import Center from "./components/Center";
import { IDL, PROGRAM_ID } from "./lib/counter";
// import { IDL, PROGRAM_ID } from "./lib/lucky-draw";
// import { IDL, PROGRAM_ID } from "./lib/dns";
import withProviders from "./withProviders";
import { useSails } from "./hooks/useSails";

import "./App.css";

const AppContent = () => {
  const { api } = useApi();
  const { selectedAccount } = useWallet();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { sails, loading, error } = useSails(IDL, PROGRAM_ID);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="p-4 h-16 sticky navbar top-0 z-50 glass">
        <StickyNavbar toggleSidebar={toggleSidebar} />
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </nav>

      <main className="grow -mt-16 pt-16 shadow-none h-full">
        {!api
          ? (
            <div className="flex items-center justify-center h-[50vh]">
              <Loader size="lg" />
            </div>
          )
          : error
          ? (
            <div className="flex items-center justify-center h-[50vh]">
              <div className="alert alert-error">
                Failed to initialize Sails: {error.message}
              </div>
            </div>
          )
          : (
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
              {loading && (
                <div className="flex items-center justify-center py-8">
                  <Loader size="md" />
                </div>
              )}
            </div>
          )}
      </main>
    </div>
  );
};

const App = withProviders(AppContent);

export default App;
