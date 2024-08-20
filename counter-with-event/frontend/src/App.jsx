import React, { useEffect, useState } from "react";
import { ApiProvider } from "./contexts/ApiContext";
import { WalletProvider } from "./contexts/WalletContext";
import { useApi } from "./contexts/ApiContext";
import WalletConnection from "./components/WalletConnection";
import ContractInteraction from "./components/ContractInteraction";
import EventListener from "./components/EventListener";
import { CounterProgram } from "./lib/counterProgram";

const AppContent = () => {
  const { api } = useApi();
  const [program, setProgram] = useState(null);

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
    <div className="App">
      <h1>Gear dApp Template</h1>
      <WalletConnection />
      {program && (
        <>
          <ContractInteraction program={program} />
          <EventListener program={program} />
        </>
      )}
    </div>
  );
};

const App = () => {
  return (
    <WalletProvider>
      <ApiProvider>
        <AppContent />
      </ApiProvider>
    </WalletProvider>
  );
};

export default App;
