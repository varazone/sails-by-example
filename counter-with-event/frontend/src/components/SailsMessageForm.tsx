import { useBalanceFormat } from "@gear-js/react-hooks";
import { useWallet } from "../contexts/WalletContext";
import { Input } from "@gear-js/ui";
import { HexString } from "@polkadot/util/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Sails } from "sails-js";
import { z } from "zod";

import { ValueField } from "@/shared/ui/form";
import { GasField } from "@/features/gasField";
import { useGasCalculate, useMessageActions } from "@/hooks";
import { Result } from "@/hooks/useGasCalculate/types";
import {
  getResetPayloadValue,
  PayloadValue,
  PayloadValueSchema,
} from "@/features/sails/types";
import { useService } from "@/features/sails/hooks";
import { PayloadForm } from "@/features/sails/ui/payload-form";

const getErrorMessage = (
  error: unknown,
) => (error instanceof Error ? error.message : String(error));

enum GasMethod {
  Reply = "reply",
  Handle = "handle",
  InitCreate = "initCreate",
  InitUpdate = "initUpdate",
}

type Props = {
  programId: HexString | undefined;
  sails: Sails;
};

const DEFAULT_VALUES = {
  value: "0",
  gasLimit: "700000000000",
  voucherId: "",
  keepAlive: true,
};

type Values = {
  value: string;
  gasLimit: string;
  voucherId: string;
  keepAlive: boolean;
  payload: PayloadValue;
};

const useSchema = (payloadSchema: PayloadValueSchema) => {
  return z.object({
    payload: payloadSchema,
    value: z.string().trim(),
    gasLimit: z.string().trim(),
    keepAlive: z.boolean(),
    voucherId: z.string().trim(),
  });
};

type FormattedValues = z.infer<ReturnType<typeof useSchema>>;

const SailsMessageForm = ({ programId, sails }: Props) => {
  const { getFormattedGasValue } = useBalanceFormat();
  const { selectedAccount } = useWallet();
  const service = useService(sails, "functions");

  const defaultValues = { ...DEFAULT_VALUES, payload: service.defaultValues };
  const schema = useSchema(service.schema);
  const form = useForm<Values, unknown, FormattedValues>({
    values: defaultValues,
    resolver: zodResolver(schema),
  });

  const calculateGas = useGasCalculate();
  const { sendMessage } = useMessageActions();

  const [isDisabled, setIsDisabled] = useState(false);
  const [isGasDisabled, setIsGasDisabled] = useState(false);
  const [gasInfo, setGasInfo] = useState<Result>();

  const method = GasMethod.Handle;

  const disableSubmitButton = () => setIsDisabled(true);
  const enableSubmitButton = () => setIsDisabled(false);

  const resetForm = () => {
    const values = form.getValues();
    const resetValue = {
      ...DEFAULT_VALUES,
      payload: getResetPayloadValue(values.payload),
    };

    form.reset(resetValue);
    enableSubmitButton();
    setGasInfo(undefined);
  };

  const handleSubmitForm = form.handleSubmit(({ voucherId, ...values }) => {
    disableSubmitButton();

    const payloadType = "Bytes";
    const reject = enableSubmitButton;
    const resolve = resetForm;

    sendMessage({
      message: { ...values, destination: programId! },
      payloadType,
      voucherId,
      reject,
      resolve,
    });
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmitForm}>
        <div>
          <PayloadForm
            gap="1/5"
            sails={sails}
            select={service.select}
            functionSelect={service.functionSelect}
            args={service.args}
          />

          <br />

          <ValueField name="value" label="Value:" gap="1/5" />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={!selectedAccount || isDisabled}
        >
          Send
        </button>
      </form>
    </FormProvider>
  );
};

export { SailsMessageForm };
