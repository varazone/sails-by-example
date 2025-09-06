import React from "react";
import { Link } from "react-router-dom";
import { Bug, Code, MessageSquare, Gift, Globe } from "lucide-react";
import { useWallet } from "../contexts/WalletContext";
import NetworkStatus from "../components/NetworkStatus";

const Home = () => {
  const { selectedAccount } = useWallet();

  return (
    <div>
      <main className="pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">Scaffold-Sails</span>
          </h1>
          
          {selectedAccount && (
            <div className="flex justify-center items-center space-x-2 flex-col mt-4">
              <p className="my-2 font-medium">Connected Address:</p>
              <div className="bg-base-300 px-3 py-1 rounded-md">
                <code className="text-sm font-mono">
                  {selectedAccount.address}
                </code>
              </div>
            </div>
          )}
          
          <p className="text-center text-lg mt-6">
            Get started by exploring the different examples and features below.
          </p>
        </div>

        <div className="grow w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-8 flex-col md:flex-row">
            <div className="flex flex-col bg-base-100 px-8 py-8 text-center items-center w-64 h-48 rounded-3xl shadow-md">
              <Bug size={24} className="h-8 w-8 text-primary mb-4" />
              <p>
                Debug and monitor network status in the{" "}
                <Link to="/debug" className="link link-primary">
                  Debug
                </Link>{" "}
                tab.
              </p>
            </div>

            <div className="flex flex-col bg-base-100 px-8 py-8 text-center items-center w-64 h-48 rounded-3xl shadow-md">
              <MessageSquare size={24} className="h-8 w-8 text-primary mb-4" />
              <p>
                Chat with built-in assistant in the{" "}
                <Link to="/chat" className="link link-primary">
                  Chat
                </Link>{" "}
                tab.
              </p>
            </div>

            <div className="flex flex-col bg-base-100 px-8 py-8 text-center items-center w-64 h-48 rounded-3xl shadow-md">
              <Code size={24} className="h-8 w-8 text-primary mb-4" />
              <p>
                Interact with programs using automatically generated UI in the{" "}
                <Link to="/counter" className="link link-primary">
                  Counter
                </Link>{" "}
                and{" "}
                <Link to="/dns" className="link link-primary">
                  DNS
                </Link>{" "}
                tabs.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
