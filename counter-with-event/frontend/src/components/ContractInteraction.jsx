import React, { useState } from "react";
import { useApi } from "../contexts/ApiContext";
import { useWallet } from "../contexts/WalletContext";
import { web3FromSource } from "@polkadot/extension-dapp";

const ContractInteraction = ({ program }) => {
  const [counterValue, setCounterValue] = useState(null);
  const { api } = useApi();
  const { selectedAccount } = useWallet();

  const fetchCounterValue = async () => {
    if (program) {
      const value = await program.counter.get();
      setCounterValue(value);
    }
  };

  const handleIncrement = async () => {
    if (program && api && selectedAccount) {
      const injector = await web3FromSource(selectedAccount.meta.source);
      // api.setSigner(injector.signer);
      const tx = program.counter.inc();
      tx.withAccount(selectedAccount.address, {
        signer: injector.signer,
        nonce: -1,
      });
      await tx.calculateGas();
      await tx.signAndSend();
    }
  };

  return (
    <div>
      <h2>Contract Interaction</h2>
      <button onClick={fetchCounterValue}>Get Counter Value</button>
      <p>
        Current Value: {counterValue !== null ? counterValue : "Not fetched"}
      </p>
      <button onClick={handleIncrement} disabled={!selectedAccount}>
        Increment
      </button>
    </div>
  );
};

export default ContractInteraction;
