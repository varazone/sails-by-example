import React, { useEffect, useState } from "react";
import { useApi } from "../contexts/ApiContext";
import { Settings } from "lucide-react";

const NodeInfo = () => {
  const { api } = useApi();
  const [nodeInfo, setNodeInfo] = useState({});

  useEffect(() => {
    const getInfo = async () => {
      if (!api) return;

      try {
        const [chain, nodeName, nodeVersion] = await Promise.all([
          api.rpc.system.chain(),
          api.rpc.system.name(),
          api.rpc.system.version(),
        ]);
        setNodeInfo({ chain, nodeName, nodeVersion });
      } catch (e) {
        console.error(e);
      }
    };
    getInfo();
  }, [api]);

  if (!api) {
    return <div className="text-center p-4">Loading API...</div>;
  }

  return (
    <div className="card w-80 bg-base-100 shadow-md">
      <div className="card-body">
        <h2 className="card-title">{nodeInfo.nodeName || "Unknown Node"}</h2>
        <p className="text-sm opacity-70">
          {nodeInfo.chain || "Unknown Chain"}
        </p>
        <p className="text-sm opacity-70">
          {api.provider.endpoint || null}
        </p>
        <div className="card-actions justify-start items-center">
          <Settings className="w-5 h-5" />
          <span>v{nodeInfo.nodeVersion || "Unknown"}</span>
        </div>
      </div>
    </div>
  );
};

export default NodeInfo;
