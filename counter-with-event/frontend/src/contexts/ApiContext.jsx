import React, { createContext, useContext, useEffect, useState } from "react";
import { GearApi } from "@gear-js/api";

const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  const [api, setApi] = useState(null);

  useEffect(() => {
    const initApi = async () => {
      const api = await GearApi.create({
        providerAddress: "wss://testnet.vara.network",
      });
      setApi(api);
    };

    initApi();
  }, []);

  return (
    <ApiContext.Provider value={{ api }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => useContext(ApiContext);
