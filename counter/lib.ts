import {
  BaseGearProgram,
  decodeAddress,
  GearApi,
  HexString,
} from "@gear-js/api";
import { TypeRegistry } from "@polkadot/types";
import { throwOnErrorReply, TransactionBuilder } from "sails-js";

export class CounterProgram {
  public readonly registry: TypeRegistry;
  public readonly counter: Counter;
  private _program: BaseGearProgram;

  constructor(public api: GearApi, programId?: `0x${string}`) {
    const types: Record<string, any> = {};

    this.registry = new TypeRegistry();
    this.registry.setKnownTypes({ types });
    this.registry.register(types);
    if (programId) {
      this._program = new BaseGearProgram(programId, api);
    }

    this.counter = new Counter(this);
  }

  public get programId(): `0x${string}` {
    if (!this._program) throw new Error(`Program ID is not set`);
    return this._program.id;
  }

  newCtorFromCode(
    code: Uint8Array | Buffer | HexString,
  ): TransactionBuilder<null> {
    const builder = new TransactionBuilder<null>(
      this.api,
      this.registry,
      "upload_program",
      undefined,
      "New",
      undefined,
      undefined,
      "String",
      code,
      async (programId) => {
        this._program = await BaseGearProgram.new(programId, this.api);
      },
    );
    return builder;
  }

  newCtorFromCodeId(codeId: `0x${string}`) {
    const builder = new TransactionBuilder<null>(
      this.api,
      this.registry,
      "create_program",
      undefined,
      "New",
      undefined,
      undefined,
      "String",
      codeId,
      async (programId) => {
        this._program = await BaseGearProgram.new(programId, this.api);
      },
    );
    return builder;
  }
}

export class Counter {
  constructor(private _program: CounterProgram) {}

  public inc(): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error("Program ID is not set");
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      "send_message",
      "Counter",
      "Inc",
      undefined,
      undefined,
      "Null",
      this._program.programId,
    );
  }

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
}
