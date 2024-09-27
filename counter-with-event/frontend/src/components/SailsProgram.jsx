import React from "react";
import { SailsReadWrite } from "./SailsReadWrite";
import SailsPreview from "./SailsPreview";
import SailsEvents from "./SailsEvents";

const SailsProgram = ({ sails }) => {
  return (
    <div className="flex flex-wrap gap-4 justify-start">
      <SailsReadWrite sails={sails} />
      <SailsPreview sails={sails} />
      <SailsEvents sails={sails} />
    </div>
  );
};

export default SailsProgram;
