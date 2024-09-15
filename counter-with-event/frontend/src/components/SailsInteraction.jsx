import React, { useState } from "react";
import { useApi } from "../contexts/ApiContext";
import { useWallet } from "../contexts/WalletContext";
import { web3FromSource } from "@polkadot/extension-dapp";
import { SingleAccountSigner } from "../utils/SingleAccountSigner";
import { ExternalLink } from "lucide-react";
import { ZERO_ADDRESS } from "sails-js";

const SailsInteraction = ({ sails }) => {
  const [counterValue, setCounterValue] = useState(null);
  const { api } = useApi();
  const { selectedAccount } = useWallet();

  const fetchCounterValue = async () => {
    if (sails) {
      const value = await sails.services.Counter.queries.Get(
        selectedAccount ? selectedAccount.address : ZERO_ADDRESS,
      );
      setCounterValue(value);
      window.sails = sails;
    }
  };

  const getSigner = async (api, acc) => {
    if (!selectedAccount.meta.source) {
      return new SingleAccountSigner(api.registry, acc);
    }
    const injector = await web3FromSource(selectedAccount.meta.source);
    return injector.signer;
  };

  const handleIncrement = async () => {
    if (sails && api && selectedAccount) {
      const signer = await getSigner(api, selectedAccount);
      const tx = sails.services.Counter.functions.Inc();
      tx.withAccount(selectedAccount.address, {
        signer,
        nonce: -1,
      });
      await tx.calculateGas();
      await tx.signAndSend();
    }
  };

  return (
    <div className="card w-96 bg-base-100 shadow-md">
      <div className="card-body">
        <h2 className="card-title">Program Interaction</h2>
        <div className="space-y-4">
          <div className="text-wrap">
            <h3 className="font-bold mb-2 inline-block">Program ID</h3>
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
              href={`https://idea.gear-tech.io/programs/${sails.programId}?node=${api.provider.endpoint}`}
            >
              <ExternalLink size={12} />
            </a>
            <input
              type="text"
              value={sails && sails.programId}
              readOnly={true}
              className="input input-bordered w-full mb-2"
              placeholder="Program ID"
            />
          </div>
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-title">Counter Value</div>
              <div className="stat-value">
                {counterValue !== null ? counterValue : "Not fetched"}
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              className="btn btn-primary flex-1"
              onClick={fetchCounterValue}
            >
              Get Counter Value
            </button>
            <button
              className="btn btn-secondary flex-1"
              onClick={handleIncrement}
              disabled={!selectedAccount}
            >
              Increment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SailsInteraction;
