import { decodeAddress, GearApi, HexString, Program } from "@gear-js/api";
import { TypeRegistry } from "@polkadot/types";
import {
  getFnNamePrefix,
  getServiceNamePrefix,
  throwOnErrorReply,
  TransactionBuilder,
  ZERO_ADDRESS,
} from "sails-js";

export class CounterProgram {
  public readonly registry: TypeRegistry;
  public readonly counter: Counter;
  private _program: Program;

  constructor(public api: GearApi, programId?: `0x${string}`) {
    const types: Record<string, any> = {};

    this.registry = new TypeRegistry();
    this.registry.setKnownTypes({ types });
    this.registry.register(types);
    if (programId) {
      this._program = new Program(programId, api);
    }

    this.counter = new Counter(this);
  }

  public get programId(): `0x${string}` {
    if (!this._program) throw new Error(`Program ID is not set`);
    return this._program.id;
  }

  /**
   * set initial value
   */
  newCtorFromCode(
    code: Uint8Array | Buffer | HexString,
    initial_value: number,
  ): TransactionBuilder<null> {
    const builder = new TransactionBuilder<null>(
      this.api,
      this.registry,
      "upload_program",
      ["New", initial_value],
      "(String, i32)",
      "String",
      code,
      async (programId) => {
        this._program = await Program.new(programId, this.api);
      },
    );
    return builder;
  }

  /**
   * set initial value
   */
  newCtorFromCodeId(codeId: `0x${string}`, initial_value: number) {
    const builder = new TransactionBuilder<null>(
      this.api,
      this.registry,
      "create_program",
      ["New", initial_value],
      "(String, i32)",
      "String",
      codeId,
      async (programId) => {
        this._program = await Program.new(programId, this.api);
      },
    );
    return builder;
  }
}

export class Counter {
  constructor(private _program: CounterProgram) {}

  /**
   * increment counter by 1
   */
  public inc(): TransactionBuilder<number> {
    if (!this._program.programId) throw new Error("Program ID is not set");
    return new TransactionBuilder<number>(
      this._program.api,
      this._program.registry,
      "send_message",
      ["Counter", "Inc"],
      "(String, String)",
      "i32",
      this._program.programId,
    );
  }

  /**
   * get counter value
   */
  public async get(
    originAddress?: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`,
  ): Promise<number> {
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
      at: atBlock,
    });
    throwOnErrorReply(
      reply.code,
      reply.payload.toU8a(),
      this._program.api.specVersion,
      this._program.registry,
    );
    const result = this._program.registry.createType(
      "(String, String, i32)",
      reply.payload,
    );
    return result[2].toNumber() as unknown as number;
  }

  /**
   * counter incremented to value
   */
  public subscribeToIncrementedToEvent(
    callback: (data: number) => void | Promise<void>,
  ): Promise<() => void> {
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
          getFnNamePrefix(payload) === "IncrementedTo"
        ) {
          callback(
            this._program.registry.createType(
              "(String, String, i32)",
              message.payload,
            )[2].toNumber() as unknown as number,
          );
        }
      },
    );
  }
}
