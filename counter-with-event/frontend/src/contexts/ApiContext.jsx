import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { GearApi } from "@gear-js/api";
import useLocalStorageState from "use-local-storage-state";

const ApiContext = createContext();

const DEFAULT_RPC_URL = "wss://testnet.vara.network";

export const ApiProvider = ({ children }) => {
  const [api, setApi] = useState(null);
  const [rpcUrl, setRpcUrl] = useLocalStorageState("gearApiRpcUrl", {
    defaultValue: DEFAULT_RPC_URL,
  });
  const apiRef = useRef(null);

  const initApi = async (url) => {
    try {
      if (apiRef.current) {
        await apiRef.current.disconnect();
        console.log("Disconnected previous API instance");
      }

      const newApi = await GearApi.create({
        providerAddress: url,
      });
      setApi(newApi);
      apiRef.current = newApi;
      return newApi;
    } catch (error) {
      console.error("Failed to initialize API:", error);
      setApi(null);
      return null;
    }
  };

  useEffect(() => {
    initApi(rpcUrl);

    return () => {
      if (apiRef.current) {
        apiRef.current.disconnect().then(() => {
          console.log("API disconnected on unmount");
        }).catch((error) => {
          console.error("Error disconnecting API:", error);
        });
      }
    };
  }, [rpcUrl]);

  return (
    <ApiContext.Provider value={{ api, initApi, rpcUrl, setRpcUrl }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => useContext(ApiContext);
