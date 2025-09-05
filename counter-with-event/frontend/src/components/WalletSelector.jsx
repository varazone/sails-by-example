import React from "react";
import { useWallet } from "../contexts/WalletContext";
import useWalletBalances from "../hooks/useWalletBalances";
import { formatBalance } from "@polkadot/util";
import { Check, ChevronDown, Copy, LogOut, Wallet } from "lucide-react";

const WalletSelector = () => {
  const {
    accounts,
    selectedAccount,
    setSelectedAccount,
    isWalletInstalled,
    walletNotInstalledMessage,
  } = useWallet();
  const { balances, loading } = useWalletBalances();
  const [copiedAddress, setCopiedAddress] = React.useState(null);

  const handleCopyAddress = (address) => {
    navigator.clipboard.writeText(address).then(() => {
      setCopiedAddress(address);
      setTimeout(() => setCopiedAddress(null), 2000); // Reset after 2 seconds
    });
  };

  const handleAccountSelect = (account) => {
    setSelectedAccount(account);
  };

  const handleDisconnect = () => {
    setSelectedAccount(null);
  };

  const formatBalanceDisplay = (balance) => {
    if (!balance) return "N/A";
    return formatBalance(balance, {
      decimals: 12,
      withSi: true,
      withUnit: "VARA",
    });
  };

  const isJsonEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-ghost m-1 flex items-center justify-center">
        {selectedAccount
          ? (
            <>
              <span className="mx-2">
                {formatBalanceDisplay(balances[selectedAccount.address])}
              </span>
            </>
          )
          : <Wallet size={18} />}
        {/*<ChevronDown size={12} className="mt-px hidden opacity-60 sm:inline-block" />*/}
      </label>
      <div
        tabIndex={0}
        className="dropdown-content z-1 menu p-2 shadow-sm bg-base-100 rounded-box w-md"
      >
        {selectedAccount && (
          <>
            <h3 className="font-bold mb-2 px-2">Connected Wallet</h3>
            <p className="px-2 py-1">{selectedAccount.meta.name}</p>
            <p className="px-2 py-1 text-sm opacity-70">
              {selectedAccount.address}
            </p>
            <p className="px-2 py-1">
              Balance: {loading
                ? "Loading..."
                : formatBalanceDisplay(balances[selectedAccount.address])}
            </p>
            <p className="px-2 py-1">
              Meta:{" "}
              {loading ? "Loading..." : JSON.stringify(selectedAccount.meta)}
            </p>
            <div className="flex justify-between px-2">
              <button
                onClick={handleDisconnect}
                className="btn btn-error btn-sm"
              >
                <LogOut size={18} />
                Disconnect
              </button>
            </div>
            <div className="divider"></div>
          </>
        )}

        <h3 className="font-bold mb-2 px-2">Select Wallet</h3>
        {
          /*accounts.map((account, index) => (
          <li key={account.address + index}>
            <a
              onClick={() => handleAccountSelect(account)}
              className={`justify-between ${
                selectedAccount && selectedAccount.meta === account.meta
                  ? "bg-primary text-primary-content"
                  : ""
              }`}
            >
              <span>{account.meta.name} ({account.meta.isTesting ? "testing" : account.meta.source})</span>
              <span
                className={`badge ${
                  selectedAccount && selectedAccount.meta === account.meta
                    ? "badge-primary"
                    : ""
                }`}
              >
                {loading
                  ? "Loading..."
                  : formatBalanceDisplay(balances[account.address])}
              </span>
            </a>
          </li>
        ))*/
        }
        {accounts.map((account, index) => (
          <li
            key={account.address + index}
            className={`rounded-box ${
              selectedAccount && isJsonEqual(selectedAccount.meta, account.meta)
                ? "bg-primary text-primary-content"
                : ""
            }`}
          >
            <div className="flex justify-between items-center w-full">
              <a
                onClick={() => handleAccountSelect(account)}
                className="grow flex items-center justify-between"
              >
                <span>{account.meta.name}</span>
                <span
                  className={`badge ${
                    selectedAccount &&
                      isJsonEqual(selectedAccount.meta, account.meta)
                      ? "badge-primary"
                      : ""
                  }`}
                >
                  {loading
                    ? "Loading..."
                    : formatBalanceDisplay(balances[account.address])}
                </span>
              </a>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopyAddress(account.address);
                }}
                className={`btn btn-ghost btn-xs ml-2 ${
                  selectedAccount &&
                    isJsonEqual(selectedAccount.meta, account.meta)
                    ? "text-primary-content hover:bg-primary-focus"
                    : ""
                }`}
              >
                {copiedAddress === account.address
                  ? <Check size={16} />
                  : <Copy size={16} />}
              </button>
            </div>
          </li>
        ))}

        {!isWalletInstalled && (
          <div className="alert alert-warning mt-2 text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>{walletNotInstalledMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletSelector;
