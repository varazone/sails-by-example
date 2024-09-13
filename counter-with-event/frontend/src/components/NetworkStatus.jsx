import React from "react";
import NodeInfo from "./NodeInfo";
import BlockNumber from "./BlockNumber";

const NetworkStatus = () => {
  return (
    <div className="flex flex-wrap gap-4 justify-start">
      <NodeInfo />
      <BlockNumber />
      <BlockNumber finalized />
    </div>
  );
};

export default NetworkStatus;
