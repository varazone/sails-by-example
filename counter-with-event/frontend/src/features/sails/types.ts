import { Sails } from "sails-js";

import { RESULT } from "./consts";
import { getPayloadSchema } from "./utils";

// TODO: import from sails-js
type ISailsFuncArg = InstanceType<
  typeof Sails
>["services"][string]["functions"][string]["args"][number];
type Ctors = InstanceType<typeof Sails>["ctors"];
type Services = InstanceType<typeof Sails>["services"];

type SailsService = Services[string];
type Functions = SailsService[keyof SailsService];
type ISailsCtorFuncParams = Sails["ctors"][string];
type SailsServiceFunc = SailsService["functions"][string];
type SailsServiceQuery = SailsService["queries"][string];
type SailsServiceEvent = SailsService["events"][string];

type Result = typeof RESULT[keyof typeof RESULT];
type PayloadValue = string | boolean | null | Array<PayloadValue> | {
  [key: string]: PayloadValue;
};
type PayloadValueSchema = ReturnType<typeof getPayloadSchema>;

const isString = (value: unknown): value is string => typeof value === "string";

const getResetPayloadValue = (value: PayloadValue): PayloadValue => {
  if (isString(value)) return "";
  if (typeof value === "boolean") return false;
  if (Array.isArray(value)) {
    return value.map((_value) => getResetPayloadValue(_value));
  }

  if (typeof value === "object" && value !== null) {
    return Object.fromEntries(
      Object.entries(value).map(([key, _value]) =>
        [key, getResetPayloadValue(_value)] as const
      ),
    );
  }

  return value;
};

export type {
  Ctors,
  Functions,
  ISailsCtorFuncParams,
  ISailsFuncArg,
  PayloadValue,
  PayloadValueSchema,
  Result,
  SailsService,
  SailsServiceEvent,
  SailsServiceFunc,
  SailsServiceQuery,
  Services,
};

export { getResetPayloadValue, isString };
