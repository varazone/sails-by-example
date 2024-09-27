import { useApi } from "@gear-js/react-hooks";

const BalanceUnit = () => {
  const { api, isApiReady } = useApi();
  const [unit] = isApiReady ? api.registry.chainTokens : ["Unit"];

  return <span className={""}>{unit}</span>;
};

export { BalanceUnit };
