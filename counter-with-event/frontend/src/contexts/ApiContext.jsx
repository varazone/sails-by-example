import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { GearApi } from "@gear-js/api";
import useLocalStorageState from "use-local-storage-state";
import { useSearchParams } from "react-router-dom";

const ApiContext = createContext();

const DEFAULT_RPC_URL = "wss://testnet.vara.network";
const parsedQuery = new URLSearchParams(window.location.search);
const querySocket = parsedQuery.get("rpc");

export const ApiProvider = ({ children }) => {
  const apiRef = useRef(null);
  const [api, setApi] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [storedRpcUrl, setStoredRpcUrl] = useLocalStorageState(
    "gearApiRpcUrl",
    {
      defaultValue: DEFAULT_RPC_URL,
    },
  );

  const rpcUrl = searchParams.get("rpc") || storedRpcUrl || DEFAULT_RPC_URL;

  const setRpcUrl = (newUrl) => {
    if (apiRef.current && (rpcUrl === newUrl)) return false;

    const urlToSet = newUrl || DEFAULT_RPC_URL;

    const newSearchParams = new URLSearchParams(searchParams);
    if (newUrl) {
      newSearchParams.set("rpc", urlToSet);
    } else {
      newSearchParams.delete("rpc");
    }

    setSearchParams(newSearchParams);
    setStoredRpcUrl(urlToSet);

    return true;
  };

  const disconnect = async () => {
    if (apiRef.current) {
      await apiRef.current.disconnect();
      setApi(null);
      apiRef.current = null;
      console.log("API disconnected manually");
    }
  };

  const initApi = async (url) => {
    try {
      if (apiRef.current) {
        await apiRef.current.disconnect();
        console.log("Disconnected previous API instance");
      }

      console.log("⚙️ Connecting to", rpcUrl);
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
    <ApiContext.Provider value={{ api, initApi, rpcUrl, setRpcUrl, disconnect }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => useContext(ApiContext);
