import React from "react";
import { useWallet } from "../contexts/WalletContext";
import useWalletBalances from "../hooks/useWalletBalances";
import { formatBalance } from "@polkadot/util";

const WalletManager = () => {
  const {
    accounts,
    selectedAccount,
    setSelectedAccount,
    isWalletInstalled,
    walletNotInstalledMessage,
  } = useWallet();
  const { balances, loading } = useWalletBalances();

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

  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Wallet Manager</h2>
        {!selectedAccount
          ? (
            <>
              <div className="space-y-2">
                {accounts.map((account, index) => (
                  <button
                    key={account.address + index}
                    onClick={() => handleAccountSelect(account)}
                    disabled={loading}
                    className="btn btn-primary btn-block"
                  >
                    <div className="flex flex-col items-start">
                      <span>
                        {account.meta.name}{" "}
                        ({account.meta.isTesting ? "dev" : account.meta.source})
                      </span>
                      <span className="text-sm opacity-70">
                        Balance: {loading
                          ? "Loading..."
                          : formatBalanceDisplay(balances[account.address])}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
              {!isWalletInstalled && (
                <div className="alert alert-warning mt-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-current shrink-0 h-6 w-6"
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
            </>
          )
          : (
            <div className="space-y-2">
              <div className="stats shadow">
                <div className="stat">
                  <div className="stat-title">Connected Account</div>
                  <div className="stat-value text-primary">
                    {selectedAccount.meta.name}
                  </div>
                  <div className="stat-desc">{selectedAccount.address}</div>
                </div>
              </div>
              <div className="stats shadow">
                <div className="stat">
                  <div className="stat-title">Source</div>
                  <div className="stat-value">
                    {selectedAccount.meta.isTesting
                      ? "dev"
                      : selectedAccount.meta.source}
                  </div>
                </div>
              </div>
              <div className="stats shadow">
                <div className="stat">
                  <div className="stat-title">Balance</div>
                  <div className="stat-value">
                    {loading
                      ? "Loading..."
                      : formatBalanceDisplay(balances[selectedAccount.address])}
                  </div>
                </div>
              </div>
              <button
                onClick={handleDisconnect}
                className="btn btn-secondary btn-block"
              >
                Disconnect
              </button>
            </div>
          )}
      </div>
    </div>
    /*
    <div>
      <h2>Wallet Manager</h2>
      {!selectedAccount
        ? (
          <>
            <div>
              {accounts.map((account, index) => (
                <button
                  key={account.address + index}
                  onClick={() => handleAccountSelect(account)}
                  disabled={loading}
                >
                  Connect {account.meta.name}{" "}
                  ({account.meta.isTesting ? "dev" : account.meta.source})
                  <br />
                  Balance: {loading
                    ? "Loading..."
                    : formatBalanceDisplay(balances[account.address])}
                </button>
              ))}
            </div>
            <div>
              {isWalletInstalled
                ? null
                : <div>{walletNotInstalledMessage}</div>}
            </div>
          </>
        )
        : (
          <div>
            <p>
              Connected: {selectedAccount.meta.name} ({selectedAccount.address})
            </p>
            <p>
              Source: {selectedAccount.meta.isTesting
                ? "dev"
                : selectedAccount.meta.source}
            </p>
            <p>
              Balance: {loading
                ? "Loading..."
                : formatBalanceDisplay(balances[selectedAccount.address])}
            </p>
            <button onClick={handleDisconnect}>Disconnect</button>
          </div>
        )}
    </div>
    */
  );
};

export default WalletManager;
