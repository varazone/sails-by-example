import React, { useState } from "react";
import { useApi } from "../contexts/ApiContext";
import { useWallet } from "../contexts/WalletContext";
import { getSigner } from "@/utils";
import { ExternalLink } from "lucide-react";
import { ZERO_ADDRESS } from "sails-js";
import { SailsStateForm } from "./SailsStateForm";
import { SailsMessageForm } from "./SailsMessageForm";

const SailsReadWrite = ({ sails }) => {
  const { api } = useApi();
  const { selectedAccount } = useWallet();

  return (
    <div className="card w-96 bg-base-100 shadow-md">
      <div className="card-body">
        <h2 className="card-title">Program Interaction</h2>

        <div className="space-y-4">
          <div className="text-wrap">
            <h3 className="font-bold mb-2 inline-block">Program ID</h3>
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
              href={`https://idea.gear-tech.io/programs/${sails.programId}?node=${api.provider.endpoint}`}
            >
              <ExternalLink size={12} />
            </a>
            <input
              type="text"
              value={sails && sails.programId}
              readOnly={true}
              className="input input-bordered w-full mb-2"
              placeholder="Program ID"
            />
          </div>
        </div>

        <div className="divider font-bold mb-2">Send Message</div>

        <div className="space-y-4">
          <div className="text-wrap">
            <SailsMessageForm sails={sails} programId={sails.programId} />
          </div>
        </div>

        <div className="divider font-bold mb-2">Read State</div>

        <div className="space-y-4">
          <div className="text-wrap">
            <SailsStateForm sails={sails} programId={sails.programId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export { SailsReadWrite };
