import React from "react";
import ContractInteraction from "./ContractInteraction";
import EventListener from "./EventListener";

const Program = ({ program }) => {
  return (
    <div className="flex flex-wrap gap-4 justify-start">
      <ContractInteraction program={program} />
      <EventListener program={program} />
    </div>
  );
};

export default Program;
