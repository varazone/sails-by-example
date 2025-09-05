import React, { useEffect, useState } from "react";
import { useApi } from "../contexts/ApiContext";
import { ChevronDown, Wifi, WifiOff } from "lucide-react";

const Connector = () => {
  const { api, rpcUrl, setRpcUrl } = useApi();
  const [blockNumber, setBlockNumber] = useState(null);
  const [inputUrl, setInputUrl] = useState(rpcUrl);

  useEffect(() => {
    if (!api) return;

    let unsubscribe;
    api.rpc.chain.subscribeNewHeads((header) => {
      setBlockNumber(header.number.toNumber());
    }).then((unsub) => {
      unsubscribe = unsub;
    }).catch((error) => {
      console.error("Failed to subscribe to new heads:", error);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [api]);

  const handleUpdate = () => {
    setRpcUrl(inputUrl);
  };

  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-ghost m-1 flex items-center justify-center">
        {api && blockNumber
          ? (
            <>
              <span className="mx-2">{blockNumber.toLocaleString()}</span>
            </>
          )
          : <WifiOff size={18} />}
        {/*<ChevronDown size={18} />*/}
      </label>
      <div
        tabIndex={0}
        className="dropdown-content z-1 menu p-2 shadow-sm bg-base-100 rounded-box w-[16rem]"
      >
        <div className="p-2">
          <h3 className="font-bold mb-2">RPC URL</h3>
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className="input input-bordered w-full mb-2"
            placeholder="Enter RPC URL"
          />
          <button
            className="btn btn-primary btn-sm w-full"
            onClick={handleUpdate}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default Connector;
