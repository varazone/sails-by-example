import React from "react";
import { X } from "lucide-react";
// import RpcUrlCustomizer from "./RpcUrlCustomizer";
// import BlockNumber from "./BlockNumber";
import WalletManager from "./WalletManager";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <>
      {/* Backdrop overlay - excludes navbar area */}
      {isOpen && (
        <div
          className="fixed top-16 bottom-0 left-0 right-0 z-60"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-16 bottom-0 left-0 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition duration-200 ease-in-out z-70 w-96 bg-base-200 overflow-y-auto shadow-xl`}
      >
        <div className="p-5">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-semibold">Settings</h2>
            <button
              className="btn btn-square btn-ghost"
              onClick={toggleSidebar}
            >
              <X size={20} />
            </button>
          </div>
          <WalletManager />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
