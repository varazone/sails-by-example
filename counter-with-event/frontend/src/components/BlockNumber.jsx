import React, { useEffect, useState } from "react";
import { useApi } from "../contexts/ApiContext";

const BlockNumber = () => {
  const { api } = useApi();
  const [blockNumber, setBlockNumber] = useState(null);

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

  return (
    /*
    <div>
      <h3>Current Block Number</h3>
      {(api && blockNumber)
        ? <p>{blockNumber.toLocaleString()}</p>
        : <p>Loading...</p>}
    </div>
    */
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Current Block Number</h2>
        {(api && blockNumber)
          ? (
            <div className="stats shadow">
              <div className="stat">
                <div className="stat-title">Block</div>
                <div className="stat-value">{blockNumber.toLocaleString()}</div>
              </div>
            </div>
          )
          : (
            <div className="alert alert-info">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="stroke-current shrink-0 w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                >
                </path>
              </svg>
              <span>Loading...</span>
            </div>
          )}
      </div>
    </div>
  );
};

export default BlockNumber;
