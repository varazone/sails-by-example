import { decodeAddress, GearApi } from "@gear-js/api";
import { TypeRegistry } from "@polkadot/types";
import { TransactionBuilder } from "sails-js";

export class CounterProgram {
  public readonly registry: TypeRegistry;
  public readonly counter: Counter;

  constructor(public api: GearApi, public programId?: `0x${string}`) {
    const types: Record<string, any> = {};

    this.registry = new TypeRegistry();
    this.registry.setKnownTypes({ types });
    this.registry.register(types);

    this.counter = new Counter(this);
  }

  newCtorFromCode(code: Uint8Array | Buffer): TransactionBuilder<null> {
    const builder = new TransactionBuilder<null>(
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

  newCtorFromCodeId(codeId: `0x${string}`) {
    const builder = new TransactionBuilder<null>(
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
  constructor(private _program: CounterProgram) {}

  public inc(): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error("Program ID is not set");
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      "send_message",
      ["Counter", "Inc"],
      "(String, String)",
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
    return result[2].toNumber() as unknown as number;
  }
}
