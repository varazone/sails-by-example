import React, { useEffect, useState } from "react";
import { useApi } from "../contexts/ApiContext";
import { Clock } from "lucide-react";

const BlockNumber = ({ finalized = false }) => {
  const { api } = useApi();
  const [blockNumber, setBlockNumber] = useState(0);
  const [blockNumberTimer, setBlockNumberTimer] = useState(0);

  useEffect(() => {
    let unsubscribe;

    const bestNumber = finalized
      ? api?.derive?.chain?.bestNumberFinalized
      : api?.derive?.chain?.bestNumber;

    if (bestNumber) {
      bestNumber((number) => {
        setBlockNumber(number.toNumber().toLocaleString("en-US"));
        setBlockNumberTimer(0);
      })
        .then((unsub) => {
          unsubscribe = unsub;
        })
        .catch(console.error);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
        console.log("Unsubscribing bestNumber...");
      }
    };
  }, [api, finalized]);

  useEffect(() => {
    const id = setInterval(() => setBlockNumberTimer((time) => time + 1), 1000);
    return () => clearInterval(id);
  }, []);

  if (!api?.derive?.chain) {
    return null;
  }

  return (
    <div className="card w-80 bg-base-100 shadow-md">
      <div className="card-body">
        <h2 className="card-title text-lg">
          {finalized ? "Finalized" : "Current"} Block
        </h2>
        <p className="text-3xl font-bold">{blockNumber}</p>
        <div className="flex items-center justify-end mt-2">
          <Clock className="w-4 h-4 mr-1" />
          <span className="text-sm">{blockNumberTimer}s</span>
        </div>
      </div>
    </div>
  );
};

export default BlockNumber;
