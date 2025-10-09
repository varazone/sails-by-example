/* eslint-disable */

import { BaseGearProgram, GearApi, HexString } from "@gear-js/api";
import { TypeRegistry } from "@polkadot/types";
import { ActorId, QueryBuilder, TransactionBuilder } from "sails-js";

export class Ss58Program {
  public readonly registry: TypeRegistry;
  public readonly solvara: Solvara;
  public readonly ss58: Ss58;
  public readonly bs58: Bs58;
  private _program?: BaseGearProgram;

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
      this._program = new BaseGearProgram(programId, api);
    }

    this.solvara = new Solvara(this);
    this.ss58 = new Ss58(this);
    this.bs58 = new Bs58(this);
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
      null,
      "New",
      null,
      null,
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
      null,
      "New",
      null,
      null,
      "String",
      codeId,
      async (programId) => {
        this._program = await BaseGearProgram.new(programId, this.api);
      },
    );
    return builder;
  }
}

export class Solvara {
  constructor(private _program: Ss58Program) {}

  /**
   * convert Solana base58 address to Vara SS58 address
   */
  public solanaToVara(solana_address: string): QueryBuilder<string> {
    return new QueryBuilder<string>(
      this._program.api,
      this._program.registry,
      this._program.programId,
      "Solvara",
      "SolanaToVara",
      solana_address,
      "String",
      "String",
    );
  }

  /**
   * convert Vara SS58 address to Solana base58 address
   */
  public varaToSolana(vara_address: string): QueryBuilder<string> {
    return new QueryBuilder<string>(
      this._program.api,
      this._program.registry,
      this._program.programId,
      "Solvara",
      "VaraToSolana",
      vara_address,
      "String",
      "String",
    );
  }
}

export class Ss58 {
  constructor(private _program: Ss58Program) {}

  /**
   * convert ActorId to ss58 address
   */
  public actorIdToSs58(
    actor_id: ActorId,
    format: Ss58AddressFormat,
  ): QueryBuilder<string> {
    return new QueryBuilder<string>(
      this._program.api,
      this._program.registry,
      this._program.programId,
      "Ss58",
      "ActorIdToSs58",
      [actor_id, format],
      "([u8;32], Ss58AddressFormat)",
      "String",
    );
  }

  /**
   * get own ss58 address
   */
  public mySs58Address(): QueryBuilder<string> {
    return new QueryBuilder<string>(
      this._program.api,
      this._program.registry,
      this._program.programId,
      "Ss58",
      "MySs58Address",
      null,
      null,
      "String",
    );
  }

  /**
   * convert ss58 address to ActorId
   */
  public ss58ToActorId(ss58_address: string): QueryBuilder<ActorId> {
    return new QueryBuilder<ActorId>(
      this._program.api,
      this._program.registry,
      this._program.programId,
      "Ss58",
      "Ss58ToActorId",
      ss58_address,
      "String",
      "[u8;32]",
    );
  }
}

export class Bs58 {
  constructor(private _program: Ss58Program) {}

  /**
   * convert base58 string to bytes
   */
  public decode(ss58_address: string): QueryBuilder<`0x${string}`> {
    return new QueryBuilder<`0x${string}`>(
      this._program.api,
      this._program.registry,
      this._program.programId,
      "Bs58",
      "Decode",
      ss58_address,
      "String",
      "Vec<u8>",
    );
  }

  /**
   * convert bytes to base58 string
   */
  public encode(bytes: `0x${string}`): QueryBuilder<string> {
    return new QueryBuilder<string>(
      this._program.api,
      this._program.registry,
      this._program.programId,
      "Bs58",
      "Encode",
      bytes,
      "Vec<u8>",
      "String",
    );
  }
}
