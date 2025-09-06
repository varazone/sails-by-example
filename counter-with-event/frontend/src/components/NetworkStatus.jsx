import React from "react";
import NodeInfo from "./NodeInfo";
import BlockNumber from "./BlockNumber";

const NetworkStatus = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <NodeInfo />
      <BlockNumber />
      <BlockNumber finalized />
    </div>
  );
};

export default NetworkStatus;
