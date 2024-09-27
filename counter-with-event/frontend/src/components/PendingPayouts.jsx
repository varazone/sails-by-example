import React, { useState } from "react";
import { useApi } from "../contexts/ApiContext";

const PendingPayouts = () => {
  const { api } = useApi();
  const [loading, setLoading] = useState(false);
  const [payouts, setPayouts] = useState([]);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const payoutClaimedForAddressForEra = async (stashAddress, eraIndex) => {
    const claimed =
      (await api.query.staking.claimedRewards(eraIndex, stashAddress)).length >
        0;
    if (claimed) {
      return true;
    }
    const exposureForEra = await api.query.staking.erasStakersOverview(
      eraIndex,
      stashAddress,
    );
    return exposureForEra.isNone;
  };

  const hasEraPoints = async (stash, eraToCheck) => {
    try {
      const rewardpoints = await api.query.staking.erasRewardPoints(eraToCheck);
      return rewardpoints.individual.some((_, validator) =>
        stash === validator.toString()
      );
    } catch {
      return false;
    }
  };

  const listPendingPayouts = async () => {
    if (!api) {
      setError("API not connected");
      return;
    }

    setLoading(true);
    setError(null);
    setPayouts([]);
    setProgress(0);

    try {
      const activeEra = await api.query.staking.activeEra();
      const currentEra = activeEra.unwrap().index.toNumber();
      const historyDepth = await api.consts.staking.historyDepth;
      const eraDepth = historyDepth.toNumber();
      const startEra = Math.max(0, currentEra - eraDepth);

      const pendingPayouts = [];

      const validators = await api.query.staking.validators.entries();
      let validatorCount = 0;

      for (const [key, _] of validators) {
        validatorCount++;
        const stash = key.args[0].toString();
        const controllerOpt = await api.query.staking.bonded(stash);
        if (controllerOpt.isNone) {
          console.warn(`${stash} is not a valid stash address.`);
          continue;
        }

        const controller = controllerOpt.unwrap();

        for (let era = startEra; era <= currentEra; era++) {
          const payoutClaimed = await payoutClaimedForAddressForEra(
            controller.toString(),
            era,
          );
          if (payoutClaimed) {
            continue;
          }

          if (await hasEraPoints(stash, era)) {
            pendingPayouts.push({ stash, era });
          }
        }

        setProgress(Math.floor((validatorCount / validators.length) * 100));
        setPayouts([...pendingPayouts]); // Update payouts as we go
      }

      setPayouts(pendingPayouts);
    } catch (err) {
      setError("Failed to fetch pending payouts");
      console.error(err);
    } finally {
      setLoading(false);
      setProgress(100);
    }
  };

  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Polkadot Pending Payouts</h2>
        <button
          className={`btn btn-primary ${loading ? "loading" : ""}`}
          onClick={listPendingPayouts}
          disabled={loading || !api}
        >
          {loading ? "Fetching..." : "List All Pending Payouts"}
        </button>
        {loading && (
          <div className="w-full mt-4">
            <progress
              className="progress progress-primary w-full"
              value={progress}
              max="100"
            >
            </progress>
            <p className="text-center mt-2">{progress}% Complete</p>
          </div>
        )}
        {error && (
          <div className="alert alert-error shadow-lg mt-4">{error}</div>
        )}
        {payouts.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Pending Payouts:</h3>
            <ul className="max-h-60 overflow-y-auto">
              {payouts.map(({ stash, era }, index) => (
                <li key={index} className="text-sm">
                  Stash: {stash.slice(0, 6)}...{stash.slice(-6)}, Era: {era}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingPayouts;
