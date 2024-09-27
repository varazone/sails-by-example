import React, { useEffect } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useApi } from "../contexts/ApiContext";
import { HexString } from "@gear-js/api";
import { AnyJson } from "@polkadot/types/types";
import { z } from "zod";
import { Sails, ZERO_ADDRESS } from "sails-js";
import { useService } from "@/features/sails/hooks";
import { PayloadForm } from "@/features/sails/ui/payload-form";

type PayloadValue =
  | string
  | string[]
  | PayloadValue[]
  | null
  | {
    [key: string]: PayloadValue;
  };

const INITIAL_VALUES = {
  payload: "",
};

const downloadJson = (state: AnyJson) => {
  const json = JSON.stringify(state, null, 2);
  const blob = new Blob([json], { type: "application/json" });

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.setAttribute("style", "display: none");
  link.setAttribute("href", url);
  link.setAttribute("download", "state");

  document.body.appendChild(link);
  link.click();

  window.URL.revokeObjectURL(url);
  document.body.removeChild(link);
};

const getPreformattedText = (data: unknown) => JSON.stringify(data, null, 4);
const isUndefined = (value: unknown): value is undefined => value === undefined;

const SailsStateForm = (
  { programId, sails }: { programId: HexString; sails: Sails },
) => {
  const { api } = useApi();
  const { select, functionSelect, args, decodeResult, ...query } = useService(
    sails,
    "queries",
  );

  const defaultValues = { ...INITIAL_VALUES, payload: query.defaultValues };
  const schema = query.schema ? z.object({ payload: query.schema }) : undefined;
  const form = useForm({
    values: defaultValues,
    resolver: schema ? zodResolver(schema) : undefined,
  });
  const payloadValue = useWatch({ control: form.control, name: "payload" });

  const readQuery = async (
    payload: PayloadValue | undefined,
  ): Promise<AnyJson> => {
    if (!api) throw new Error("API is not initialized");
    if (!decodeResult) throw new Error("Sails is not found");

    const result = await api.message.calculateReply({
      destination: programId,
      origin: ZERO_ADDRESS,
      value: 0,
      gasLimit: api.blockGasLimit.toBigInt(),
      payload,
    });

    return decodeResult(result.payload.toHex());
  };

  const state = useMutation({
    mutationFn: readQuery,
    onError: ({ message }) => window.alert(message),
  });
  const isStateExists = !isUndefined(state.data);

  const handleSubmit = form.handleSubmit(({ payload }) =>
    state.mutate(payload as PayloadValue)
  );

  useEffect(() => {
    state.reset();
  }, [payloadValue]);

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Program ID:</span>
          </label>
          <input
            type="text"
            className="input input-bordered"
            value={programId}
            readOnly
          />
        </div>

        {sails && args && (
          <PayloadForm
            sails={sails}
            select={select}
            functionSelect={functionSelect}
            args={args}
          />
        )}

        <div className="form-control">
          <label className="label">
            <span className="label-text">Statedata:</span>
          </label>
          <textarea
            className={`textarea textarea-bordered h-64 ${
              state.isPending ? "loading" : ""
            }`}
            value={state.isPending
              ? ""
              : isStateExists
              ? getPreformattedText(state.data)
              : ""}
            readOnly
          />
        </div>

        <div className="flex space-x-4">
          <button type="submit" className="btn btn-primary">
            Read
          </button>

          {!state.isPending && isStateExists && (
            <button
              onClick={() => downloadJson(state.data)}
              className="btn btn-secondary"
            >
              Download JSON
            </button>
          )}

          <button onClick={() => window.history.back()} className="btn">
            Back
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

/*
const Sails = () => {
  const programId = useProgramId();
  const { data: program } = useProgram(programId);
  const { sails } = useSails(program?.codeId);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Read Program State</h2>
      {sails ? <StateForm programId={programId} sails={sails} /> : null}
    </div>
  );
};
*/

export default SailsStateForm;
