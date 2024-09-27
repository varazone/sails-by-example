import React from "react";
import SailsInteraction from "./SailsInteraction";
import SailsPreview from "./SailsPreview";
import SailsEvents from "./SailsEvents";
import SailsStateForm from "./SailsStateForm";

const SailsProgram = ({ sails }) => {
  return (
    <div className="flex flex-wrap gap-4 justify-start">
      <SailsInteraction sails={sails} />
      <SailsPreview sails={sails} />
      <SailsEvents sails={sails} />
      <SailsStateForm sails={sails} programId={sails.programId} />
    </div>
  );
};

export default SailsProgram;
