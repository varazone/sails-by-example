import { useApi } from "@/contexts/ApiContext";

const BalanceUnit = () => {
  const { api } = useApi();
  const [unit] = api ? api.registry.chainTokens : ["Unit"];

  return <span className={""}>{unit}</span>;
};

export { BalanceUnit };
