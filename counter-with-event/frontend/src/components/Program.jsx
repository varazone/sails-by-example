import React from "react";
import ProgramInteraction from "./ProgramInteraction";
import ProgramEvents from "./ProgramEvents";

const Program = ({ program }) => {
  return (
    <div className="flex flex-wrap gap-4 justify-start">
      <ProgramInteraction program={program} />
      <ProgramEvents program={program} />
    </div>
  );
};

export default Program;
