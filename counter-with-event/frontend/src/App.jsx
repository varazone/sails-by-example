import React, { useEffect, useState } from "react";
import { ApiProvider } from "./contexts/ApiContext";
import { WalletProvider } from "./contexts/WalletContext";
import { useApi } from "./contexts/ApiContext";
import NetworkStatus from "./components/NetworkStatus";
import Program from "./components/Program";
import StickyNavbar from "./components/StickyNavbar";
import Sidebar from "./components/Sidebar";
import Loader from "./components/Loader";
import Center from "./components/Center";
import { CounterProgram } from "./lib/counterProgram";
import { BrowserRouter as Router } from "react-router-dom";

import "./App.css";

const AppContent = () => {
  const { api } = useApi();
  const [program, setProgram] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    if (api) {
      const program = new CounterProgram(
        api,
        "0xdf51c3de695524bac0580d7cd5c90fcf248e04443a0a38f541e98b3f9167ca1e",
      ); // Replace with your actual program ID
      setProgram(program);
    }
  }, [api]);

  return (
    <div className="min-h-screen bg-base-200">
      <StickyNavbar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {api
        ? (
          <div className="bg-base-100 shadow-xl">
            <div className="card-body">
              <NetworkStatus />
            </div>
            {program &&
              (
                <div className="card-body">
                  <Program program={program} />
                </div>
              )}
          </div>
        )
        : (
          <Center fullScreen>
            <Loader size="lg" />
          </Center>
        )}
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
