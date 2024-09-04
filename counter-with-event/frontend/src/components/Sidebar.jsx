import React from "react";
import { X } from "lucide-react";
// import RpcUrlCustomizer from "./RpcUrlCustomizer";
// import BlockNumber from "./BlockNumber";
import WalletManager from "./WalletManager";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <div
      className={`fixed inset-y-0 left-0 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition duration-200 ease-in-out z-30 w-200 bg-base-200 overflow-y-auto`}
    >
      <div className="p-5">
        <button
          className="btn btn-square btn-ghost lg:hidden float-right"
          onClick={toggleSidebar}
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-semibold mb-5 mt-16 lg:mt-0">Settings</h2>
        <WalletManager />
      </div>
    </div>
  );
};

export default Sidebar;
