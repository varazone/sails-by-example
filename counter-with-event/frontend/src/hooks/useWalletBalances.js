import { useEffect, useState } from "react";
import { useApi } from "../contexts/ApiContext";
import { useWallet } from "../contexts/WalletContext";

const useWalletBalances = () => {
  const { api } = useApi();
  const { accounts } = useWallet();
  const [balances, setBalances] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe;

    const fetchBalances = async () => {
      if (!api || accounts.length === 0) {
        setLoading(false);
        return;
      }

      const addresses = accounts.map((account) => account.address);

      unsubscribe = await api.query.system.account.multi(
        addresses,
        (accountInfos) => {
          const newBalances = {};
          accountInfos.forEach((accountInfo, index) => {
            newBalances[addresses[index]] = accountInfo.data.free.toString();
          });
          setBalances(newBalances);
          setLoading(false);
        },
      );
    };

    fetchBalances();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [api, accounts]);

  return { balances, loading };
};

export default useWalletBalances;
