import { SingleAccountSigner } from "../utils/SingleAccountSigner";
import { web3FromSource } from "@polkadot/extension-dapp";

const getSigner = async (api, acc) => {
  if (!acc.meta.source) {
    return new SingleAccountSigner(api.registry, acc);
  }
  const injector = await web3FromSource(acc.meta.source);
  return injector.signer;
};

export { getSigner };
