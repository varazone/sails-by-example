import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

function getPreformattedText(obj) {
  return JSON.stringify(obj, null, 2);
}

function PreformattedBlock({ text }) {
  return (
    <pre className="bg-base-300 p-1 rounded-lg overflow-x-auto">
      <code>{text}</code>
    </pre>
  );
}

function Accordion({ heading, children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="collapse collapse-arrow bg-base-200 mb-2">
      <input
        type="checkbox"
        checked={isOpen}
        onChange={() => setIsOpen(!isOpen)}
      />
      <div className="collapse-title text-sm font-bold flex items-center">
        {heading}
      </div>
      <div className="collapse-content">
        {children}
      </div>
    </div>
  );
}

function SailsPreview({ sails }) {
  const { scaleCodecTypes, ctors, services } = sails;

  const getArgs = (args) =>
    args.map(({ name, type }) => `${name}: ${type}`).join(", ");
  const getReturnType = (type) => JSON.stringify(type).replace(/"/g, "");

  const getFunction = (name, returnType, args) =>
    `${name}: (${args ? getArgs(args) : ""}) => ${returnType}`;

  const getConstructorFunction = (name, { args }) =>
    getFunction(name, "void", args);

  const getServiceFunction = (name, { args, returnType }) =>
    getFunction(name, getReturnType(returnType), args);

  const getEventFunction = (name, { type }) =>
    getFunction(name, getReturnType(type));

  const getFunctions = (funcs, getFunc) =>
    Object.entries(funcs)
      .map(([name, func]) => getFunc(name, func))
      .join("\n");

  const serviceEntries = Object.entries(services);

  const renderServices = () =>
    serviceEntries.map(([name, { functions, queries, events }]) => (
      <Accordion key={name} heading={name}>
        <Accordion heading="Functions">
          <PreformattedBlock
            text={getFunctions(functions, getServiceFunction)}
          />
        </Accordion>

        <Accordion heading="Queries">
          <PreformattedBlock text={getFunctions(queries, getServiceFunction)} />
        </Accordion>

        <Accordion heading="Events">
          <PreformattedBlock text={getFunctions(events, getEventFunction)} />
        </Accordion>
      </Accordion>
    ));

  return (
    <div className="card w-96 bg-base-100 shadow-md">
      <div className="card-body">
        <h2 className="card-title">Program Interface</h2>
        <div className="p-0">
          <Accordion heading="Types">
            <PreformattedBlock text={getPreformattedText(scaleCodecTypes)} />
          </Accordion>

          <Accordion heading="Constructors">
            <PreformattedBlock
              text={getFunctions(ctors, getConstructorFunction)}
            />
          </Accordion>

          <Accordion heading={`Services (${serviceEntries.length})`}>
            {renderServices()}
          </Accordion>
        </div>
      </div>
    </div>
  );
}

export default SailsPreview;
