import React from "react";
import SailsInteraction from "./SailsInteraction";
import SailsPreview from "./SailsPreview";
import SailsEvents from "./SailsEvents";
import SailsStateForm from "./SailsStateForm";
import { SailsMessageForm } from "./SailsMessageForm";

const SailsProgram = ({ sails }) => {
  return (
    <div className="flex flex-wrap gap-4 justify-start">
      <SailsMessageForm sails={sails} programId={sails.programId} />
      <SailsStateForm sails={sails} programId={sails.programId} />
      <SailsPreview sails={sails} />
      <SailsEvents sails={sails} />
      <SailsInteraction sails={sails} />
    </div>
  );
};

export default SailsProgram;
