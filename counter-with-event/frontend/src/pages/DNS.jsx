import React from "react";
import { useSails } from "../hooks/useSails";
import { IDL, PROGRAM_ID } from "../lib/dns";
import SailsProgram from "../components/SailsProgram";
import Loader from "../components/Loader";

const DNS = () => {
  const { sails, loading, error } = useSails(IDL, PROGRAM_ID);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="grow">
        {error
          ? (
            <div className="flex items-center justify-center h-[50vh]">
              <div className="alert alert-error">
                Failed to initialize DNS: {error.message}
              </div>
            </div>
          )
          : (
            <div className="bg-base-100">
              {sails && (
                <div className="card-body">
                  <SailsProgram sails={sails} />
                </div>
              )}
              {loading && (
                <div className="flex items-center justify-center py-8">
                  <Loader size="md" />
                </div>
              )}
            </div>
          )}
      </main>
    </div>
  );
};

export default DNS;
