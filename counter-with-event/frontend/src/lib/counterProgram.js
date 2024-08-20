import { decodeAddress } from "@gear-js/api";
import { TypeRegistry } from "@polkadot/types";
import {
  getFnNamePrefix,
  getServiceNamePrefix,
  TransactionBuilder,
  ZERO_ADDRESS,
} from "sails-js";
export class CounterProgram {
  constructor(api, programId) {
    this.api = api;
    this.programId = programId;
    const types = {};
    this.registry = new TypeRegistry();
    this.registry.setKnownTypes({ types });
    this.registry.register(types);
    this.counter = new Counter(this);
  }
  registry;
  counter;
  newCtorFromCode(code) {
    const builder = new TransactionBuilder(
      this.api,
      this.registry,
      "upload_program",
      "New",
      "String",
      "String",
      code,
    );
    this.programId = builder.programId;
    return builder;
  }
  newCtorFromCodeId(codeId) {
    const builder = new TransactionBuilder(
      this.api,
      this.registry,
      "create_program",
      "New",
      "String",
      "String",
      codeId,
    );
    this.programId = builder.programId;
    return builder;
  }
}
export class Counter {
  constructor(_program) {
    this._program = _program;
  }
  inc() {
    if (!this._program.programId) throw new Error("Program ID is not set");
    return new TransactionBuilder(
      this._program.api,
      this._program.registry,
      "send_message",
      ["Counter", "Inc"],
      "(String, String)",
      "Null",
      this._program.programId,
    );
  }
  async get(originAddress, value, atBlock) {
    const payload = this._program.registry.createType("(String, String)", [
      "Counter",
      "Get",
    ]).toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: originAddress ? decodeAddress(originAddress) : ZERO_ADDRESS,
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock || null,
    });
    if (!reply.code.isSuccess) {
      throw new Error(
        this._program.registry.createType("String", reply.payload).toString(),
      );
    }
    const result = this._program.registry.createType(
      "(String, String, i32)",
      reply.payload,
    );
    return result[2].toNumber();
  }
  subscribeToIncrementedEvent(callback) {
    return this._program.api.gearEvents.subscribeToGearEvent(
      "UserMessageSent",
      ({ data: { message } }) => {
        if (
          !message.source.eq(this._program.programId) ||
          !message.destination.eq(ZERO_ADDRESS)
        ) {
          return;
        }
        const payload = message.payload.toHex();
        if (
          getServiceNamePrefix(payload) === "Counter" &&
          getFnNamePrefix(payload) === "Incremented"
        ) {
          callback(
            this._program.registry.createType(
              "(String, String, i32)",
              message.payload,
            )[2].toNumber(),
          );
        }
      },
    );
  }
}
