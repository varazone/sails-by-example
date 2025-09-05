import React from "react";
import { useSails } from "../hooks/useSails";
import { useApi } from "../contexts/ApiContext";
import { IDL, PROGRAM_ID } from "../lib/dns";
import SailsProgram from "../components/SailsProgram";
import LoadingAPI from "../components/LoadingAPI";

const DNS = () => {
  const { api } = useApi();
  const { sails, loading, error } = useSails(IDL, PROGRAM_ID);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="grow">
        {!api
          ? <LoadingAPI />
          : error
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
            </div>
          )}
      </main>
    </div>
  );
};

export default DNS;
