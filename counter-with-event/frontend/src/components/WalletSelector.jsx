import React from "react";
import { useWallet } from "../contexts/WalletContext";
import useWalletBalances from "../hooks/useWalletBalances";
import { formatBalance } from "@polkadot/util";
import { Check, ChevronDown, Copy, LogOut, Wallet, ChevronRight } from "lucide-react";

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
  const [expandedGroups, setExpandedGroups] = React.useState({});

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

  const toggleGroup = (source) => {
    setExpandedGroups(prev => ({
      ...prev,
      [source]: !prev[source]
    }));
  };

  const metaSource = (meta) => {
    const source = meta.isTesting
      ? 'testing'
      : meta.source || 'unknown';
    return source;
  }

  const formatSourceName = (source) => {
    switch (source) {
      case '':
      case 'testing':
        return 'Testing Accounts';
      case 'subwallet-js':
        return 'Subwallet';
      case 'polkadot-js':
        return 'Polkadot.js';
      case 'unknown':
      default:
        return 'Unknown Source';
    }
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

  // Group accounts by source
  const groupedAccounts = accounts.reduce((groups, account) => {
    const source = metaSource(account.meta);

    if (!groups[source]) {
      groups[source] = [];
    }
    groups[source].push(account);
    return groups;
  }, {});

  return (
    <div className="dropdown dropdown-end">
      <label
        tabIndex={0}
        className="btn btn-ghost m-1 flex items-center justify-center"
      >
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
        className="dropdown-content z-1 bg-base-100 rounded-box shadow-sm p-2 w-96 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // Prevent click from closing dropdown
      >
        {selectedAccount && (
          <>
            <h3 className="font-bold mb-2 px-2">Connected Wallet</h3>
            <div className="px-2 py-1 flex justify-between items-center select-text">
              <span className="flex items-center gap-1">
                {loading ? "Loading..." : (
                  <>
                    {formatSourceName(metaSource(selectedAccount.meta))}
                    <ChevronRight size={12} className="opacity-60" />
                    {selectedAccount.meta.name}
                  </>
                )}
              </span>
            </div>
            <div className="px-2 py-1">
              <pre className="text-xs bg-base-200 p-2 rounded break-all select-text overflow-x-auto">
                {selectedAccount.address}
              </pre>
            </div>
            <div className="flex justify-end px-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDisconnect();
                  // Keep dropdown open after disconnect
                  setIsDropdownOpen(true);
                }}
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
        {Object.entries(groupedAccounts).map(([source, sourceAccounts]) => {
          const isExpanded = expandedGroups[source] !== false; // Default to expanded

          return (
            <div key={source} className="mb-2">
              <button
                onClick={() => toggleGroup(source)}
                className="flex items-center justify-between w-full px-2 py-1 text-left hover:bg-base-200 rounded-box"
              >
                <h4 className="font-semibold text-sm opacity-70">{formatSourceName(source)}</h4>
                {isExpanded ? (
                  <ChevronDown size={14} className="opacity-60" />
                ) : (
                  <ChevronRight size={14} className="opacity-60" />
                )}
              </button>
              {isExpanded && (
                <ul className="ml-4">
                  {sourceAccounts.map((account, index) => (
                    <li
                      key={account.address + index}
                      className={`rounded-box ${
                        selectedAccount && isJsonEqual(selectedAccount.meta, account.meta)
                          ? "bg-primary text-primary-content"
                          : "hover:bg-base-200"
                      }`}
                    >
                      <div className="flex justify-between items-center w-full py-1">
                        <a
                          onClick={() => handleAccountSelect(account)}
                          className="grow flex items-center justify-between"
                        >
                          <span className="text-sm pl-2">{account.meta.name}</span>
                          <span
                            className={`badge badge-sm ${
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
                            ? <Check size={14} />
                            : <Copy size={14} />}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}

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
