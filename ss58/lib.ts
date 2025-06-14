import { decodeAddress, GearApi, HexString, Program } from "@gear-js/api";
import { TypeRegistry } from "@polkadot/types";
import { ActorId, throwOnErrorReply, TransactionBuilder } from "sails-js";

export class Ss58Program {
  public readonly registry: TypeRegistry;
  public readonly ss58: Ss58;
  private _program: Program;

  constructor(public api: GearApi, programId?: `0x${string}`) {
    const types: Record<string, any> = {
      Ss58AddressFormat: {
        "_enum": {
          "Polkadot": "Null",
          "Kusama": "Null",
          "Substrate": "Null",
          "Vara": "Null",
          "Custom": "u16",
        },
      },
    };

    this.registry = new TypeRegistry();
    this.registry.setKnownTypes({ types });
    this.registry.register(types);
    if (programId) {
      this._program = new Program(programId, api);
    }

    this.ss58 = new Ss58(this);
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
      "New",
      "String",
      "String",
      code,
      async (programId) => {
        this._program = await Program.new(programId, this.api);
      },
    );
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
      async (programId) => {
        this._program = await Program.new(programId, this.api);
      },
    );
    return builder;
  }
}

export class Ss58 {
  constructor(private _program: Ss58Program) {}

  /**
   * convert ActorId to ss58 address
   */
  public async actorIdToSs58(
    actor_id: ActorId,
    format: Ss58AddressFormat,
    originAddress?: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`,
  ): Promise<string> {
    const payload = this._program.registry.createType(
      "(String, String, [u8;32], Ss58AddressFormat)",
      ["Ss58", "ActorIdToSs58", actor_id, format],
    ).toHex();
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
      "(String, String, String)",
      reply.payload,
    );
    return result[2].toString() as unknown as string;
  }

  /**
   * get own ss58 address
   */
  public async mySs58Address(
    originAddress?: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`,
  ): Promise<string> {
    const payload = this._program.registry.createType("(String, String)", [
      "Ss58",
      "MySs58Address",
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
      "(String, String, String)",
      reply.payload,
    );
    return result[2].toString() as unknown as string;
  }

  /**
   * convert ss58 address to ActorId
   */
  public async ss58ToActorId(
    ss58_address: string,
    originAddress?: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`,
  ): Promise<ActorId> {
    const payload = this._program.registry.createType(
      "(String, String, String)",
      ["Ss58", "Ss58ToActorId", ss58_address],
    ).toHex();
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
      "(String, String, [u8;32])",
      reply.payload,
    );
    return result[2].toJSON() as unknown as ActorId;
  }
}
