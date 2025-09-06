import React from "react";
import { useApi } from "../contexts/ApiContext";
import { useSails } from "../hooks/useSails";
import LoadingAPI from "../components/LoadingAPI";
import NetworkStatus from "../components/NetworkStatus";

const Debug = () => {
  const { api, apiState } = useApi();
  const { sails, loading, error } = useSails();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="grow p-6">
        <div className="card-body">
          <NetworkStatus />
        </div>

        {!api
          ? <LoadingAPI />
          : error
          ? (
            <div className="flex items-center justify-center h-[50vh]">
              <div className="alert alert-error">
                Failed to initialize Debug: {error.message}
              </div>
            </div>
          )
          : (
            <div className="bg-base-100 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h2 className="card-title">API Status</h2>
                    <pre className="text-sm overflow-x-auto">
                    {JSON.stringify(apiState, null, 2)}
                    </pre>
                  </div>
                </div>

                <div className="card bg-base-200">
                  <div className="card-body">
                    <h2 className="card-title">Sails Status</h2>
                    <pre className="text-sm overflow-x-auto">
                    {JSON.stringify({
                      loading,
                      error: error?.message,
                      isConnected: !!sails,
                      programId: sails?.programId
                    }, null, 2)}
                    </pre>
                  </div>
                </div>

                <div className="card bg-base-200 md:col-span-2">
                  <div className="card-body">
                    <h2 className="card-title">System Info</h2>
                    <pre className="text-sm overflow-x-auto">
                    {JSON.stringify({
                      userAgent: navigator.userAgent,
                      platform: navigator.platform,
                      language: navigator.language,
                      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                      screen: {
                        width: window.screen.width,
                        height: window.screen.height,
                        availWidth: window.screen.availWidth,
                        availHeight: window.screen.availHeight
                      }
                    }, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}
      </main>
    </div>
  );
};

export default Debug;
