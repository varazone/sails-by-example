import {
  MessageSendOptions,
  MessageSendReplyOptions,
  ProgramMetadata,
} from "@gear-js/api";
import { SubmittableExtrinsic } from "@polkadot/api/types";
import { ISubmittableResult } from "@polkadot/types/types";

import {
  OperationCallbacks,
  ParamsToSignAndSend as CommonParamsToSignAndSend,
} from "@/entities/hooks";

type ParamsToSendMessage = OperationCallbacks & {
  message: MessageSendOptions;
  voucherId: string;
  metadata?: ProgramMetadata;
  payloadType?: string;
};

type ParamsToReplyMessage = OperationCallbacks & {
  reply: MessageSendReplyOptions;
  voucherId: string;
  metadata?: ProgramMetadata;
  payloadType?: string;
};

type ParamsToSignAndSend = CommonParamsToSignAndSend & {
  // extrinsic: SubmittableExtrinsic<"promise", ISubmittableResult>;
  extrinsic: any;
  title?: string;
};

export type { ParamsToReplyMessage, ParamsToSendMessage, ParamsToSignAndSend };
