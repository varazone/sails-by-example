import { useApi } from "@/contexts/ApiContext";
import { useWallet } from "@/contexts/WalletContext";
import { useCallback } from "react";
import { getSigner } from "@/utils";

import { TransactionName } from "@/shared/config";

import { ParamsToReplyMessage, ParamsToSendMessage } from "./types";

enum Method {
  Transfer = "Transfer",
  CodeChanged = "CodeChanged",
  ProgramChanged = "ProgramChanged",
  UserMessageSent = "UserMessageSent",
  UserMessageRead = "UserMessageRead",
  MessageQueued = "MessageQueued",
  MessagesDispatched = "MessagesDispatched",
  MessageWaited = "MessageWaited",
  MessageWaken = "MessageWaken",
  ExtrinsicFailed = "ExtrinsicFailed",
  ExtrinsicSuccess = "ExtrinsicSuccess",
  VoucherIssued = "VoucherIssued",

  // extrinsics
  SendMessage = "sendMessage",
  SendReply = "sendReply",
  UploadProgram = "uploadProgram",
  CreateProgram = "createProgram",
}

const useMessageActions = () => {
  const { api } = useApi();
  const { selectedAccount } = useWallet();

  const sendMessage = useCallback(
    async (
      { metadata, message, payloadType, voucherId, reject, resolve }:
        ParamsToSendMessage,
    ) => {
      try {
        if (!api) throw new Error("API is not initialized");
        if (!selectedAccount) throw new Error("No account connected");

        const signer = await getSigner(api, selectedAccount);
        const { address } = selectedAccount;

        const sendExtrinsic = api.message.send(message, metadata, payloadType);

        const extrinsic = voucherId
          ? api.voucher.call(voucherId, { SendMessage: sendExtrinsic })
          : sendExtrinsic;

        const { partialFee } = await api.message.paymentInfo(address, {
          signer,
        });

        extrinsic.signAndSend(
          selectedAccount.address,
          { signer, nonce: -1 },
          ({ status, dispatchError }) => {
            if (status.isInBlock) {
              if (dispatchError) {
                if (reject) reject();
              } else {
                if (resolve) resolve();
              }
            }
          },
        );
      } catch (error) {
        const errorMessage = (error as Error).message;

        window.alert(errorMessage);

        if (reject) reject();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [api, selectedAccount],
  );

  const replyMessage = useCallback(
    async (
      { reply, metadata, payloadType, voucherId, reject, resolve }:
        ParamsToReplyMessage,
    ) => {
      try {
        if (!api) throw new Error("API is not initialized");
        if (!selectedAccount) throw new Error("No account connected");

        const signer = await getSigner(api, selectedAccount);
        const { address } = selectedAccount;

        const replyExtrinsic = await api.message.sendReply(
          reply,
          metadata,
          payloadType,
        );

        const extrinsic = voucherId
          ? api.voucher.call(voucherId, { SendReply: replyExtrinsic })
          : replyExtrinsic;

        const { partialFee } = await api.message.paymentInfo(address, {
          signer,
        });

        extrinsic.signAndSend(
          signer,
          { nonce: -1 },
          ({ status, dispatchError }) => {
            if (status.isFinalized) {
              if (dispatchError) {
                if (reject) reject();
              } else {
                if (resolve) resolve();
              }
            }
          },
        );
      } catch (error) {
        const errorMessage = (error as Error).message;

        window.alert(errorMessage);

        if (reject) reject();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [api, selectedAccount],
  );

  return { sendMessage, replyMessage };
};

export { useMessageActions };
