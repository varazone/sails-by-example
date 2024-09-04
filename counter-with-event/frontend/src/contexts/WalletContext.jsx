import React, { createContext, useContext, useEffect, useState } from "react";
import { web3AccountsSubscribe, web3Enable } from "@polkadot/extension-dapp";
import { createTestPairs } from "@polkadot/keyring";

const WalletContext = createContext();
const testKeypairs = Object.values(createTestPairs());

export const WalletProvider = ({ children }) => {
  const [accounts, setAccounts] = useState(testKeypairs);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isWalletInstalled, setIsWalletInstalled] = useState(true);

  useEffect(() => {
    const initWallet = async () => {
      const extensions = await web3Enable("Gear dApp");

      if (extensions.length === 0) {
        setIsWalletInstalled(false);
        return null;
      }

      const unsubscribe = await web3AccountsSubscribe((injectedAccounts) => {
        setAccounts([...testKeypairs, ...injectedAccounts]);

        if (injectedAccounts.length === 0) {
          setIsWalletInstalled(false);
        } else {
          setIsWalletInstalled(true);
        }

        // If the selected account is no longer available, clear the selection
        if (
          selectedAccount &&
          ![...testKeypairs, ...injectedAccounts].some((acc) =>
            acc.address === selectedAccount.address
          )
        ) {
          setSelectedAccount(null);
        }
      });

      // Return the unsubscribe function to clean up on unmount
      return unsubscribe;
    };

    const unsubscribePromise = initWallet();

    // Cleanup function
    return () => {
      unsubscribePromise.then((unsubscribe) => unsubscribe && unsubscribe());
    };
  }, [selectedAccount]);

  const walletNotInstalledMessage =
    "No wallet found. Please install a compatible wallet extension.";

  return (
    <WalletContext.Provider
      value={{
        accounts,
        selectedAccount,
        setSelectedAccount,
        isWalletInstalled,
        walletNotInstalledMessage,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
