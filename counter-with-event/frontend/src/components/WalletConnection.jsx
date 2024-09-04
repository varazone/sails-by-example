import React from "react";
import { useWallet } from "../contexts/WalletContext";

const WalletConnection = () => {
  const {
    accounts,
    selectedAccount,
    setSelectedAccount,
    isWalletInstalled,
    walletNotInstalledMessage,
  } = useWallet();

  const handleAccountSelect = (account) => {
    setSelectedAccount(account);
  };

  const handleDisconnect = () => {
    setSelectedAccount(null);
  };

  return (
    <div>
      <h2>Wallet Connection</h2>
      {!selectedAccount
        ? (
          <>
            <div>
              {accounts.map((account, index) => (
                <button
                  key={account.address + index}
                  onClick={() => handleAccountSelect(account)}
                >
                  Connect {account.meta.name}{" "}
                  ({account.meta.isTesting ? "dev" : account.meta.source})
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
            <button onClick={handleDisconnect}>Disconnect</button>
          </div>
        )}
    </div>
  );
};

export default WalletConnection;
