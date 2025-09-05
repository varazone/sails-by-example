import React from "react";
import NetworkStatus from "../components/NetworkStatus";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="grow">
        <div className="bg-base-100">
          <div className="card-body">
            <NetworkStatus />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;