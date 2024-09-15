import React, { useEffect, useState } from "react";
import { useApi } from "../contexts/ApiContext";

const RpcUrlCustomizer = () => {
  const { rpcUrl, setRpcUrl } = useApi();
  const [inputUrl, setInputUrl] = useState(rpcUrl);

  const handleUpdate = () => {
    setRpcUrl(inputUrl);
  };

  return (
    /*
    <div>
      <h2>RPC URL Customizer</h2>
      <div>
        <label htmlFor="rpcUrl">
          RPC URL
        </label>
        <input
          type="text"
          id="rpcUrl"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          placeholder="Enter RPC URL"
        />
      </div>
      <button className="btn btn-primary" type="button" onClick={handleUpdate}>
        Update
      </button>
    </div>
    */
    <div className="card w-96 bg-base-100 shadow-md">
      <div className="card-body">
        <h2 className="card-title">RPC URL Customizer</h2>
        <div className="form-control w-full max-w-xs">
          <label htmlFor="rpcUrl" className="label">
            <span className="label-text">RPC URL</span>
          </label>
          <input
            type="text"
            id="rpcUrl"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="Enter RPC URL"
            className="input input-bordered w-full max-w-xs"
          />
        </div>
        <div className="card-actions justify-end mt-4">
          <button className="btn btn-primary" onClick={handleUpdate}>
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default RpcUrlCustomizer;
