import React, { useEffect, useState } from "react";
import { ApiProvider } from "./contexts/ApiContext";
import { WalletProvider } from "./contexts/WalletContext";
import { useApi } from "./contexts/ApiContext";
import ContractInteraction from "./components/ContractInteraction";
import EventListener from "./components/EventListener";
// import ThemeSwitcher from "./components/ThemeSwitcher";
// import StickyNavbar from "./components/StickyNavbar";
import StickyNavbar from "./components/StickyNavbar";
import Sidebar from "./components/Sidebar";
import { CounterProgram } from "./lib/counterProgram";

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
      <div className="transition-all duration-200">
        <div className="container mx-auto">
          {
            /*
      <StickyNavbar />
        <h1 className="text-4xl font-bold text-center mb-8">
          Gear dApp Template
        </h1>

        <div className="navbar bg-base-100">
          <div className="flex-1">
            <a className="btn btn-ghost normal-case text-4xl">
              Gear dApp Template
            </a>
          </div>
          <div className="flex-none">
            <ThemeSwitcher />
          </div>
        </div>

        <div className="divider"></div>
              <RpcUrlCustomizer />
              <div className="divider"></div>
              <BlockNumber />
              <div className="divider"></div>
              <WalletManager />
                  <div className="divider"></div>
        */
          }

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              {program && (
                <>
                  <ContractInteraction program={program} />
                  <div className="divider"></div>
                  <EventListener program={program} />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    /*
    <div className="App">
      <h1>Gear dApp Template</h1>
      <RpcUrlCustomizer />
      <BlockNumber />
      <WalletManager />
      {program && (
        <>
          <ContractInteraction program={program} />
          <EventListener program={program} />
        </>
      )}
    </div>
    */
  );
};

const App = () => {
  return (
    <ApiProvider>
      <WalletProvider>
        <AppContent />
      </WalletProvider>
    </ApiProvider>
  );
};

export default App;
