import {
  ActorId,
  getFnNamePrefix,
  getServiceNamePrefix,
  MessageId,
  TransactionBuilder,
  ZERO_ADDRESS,
} from "sails-js";
import { decodeAddress, GearApi } from "@gear-js/api";
import { TypeRegistry } from "@polkadot/types";

export interface GameState {
  admin: ActorId;
  players: Array<ActorId>;
  config: Config | null;
  winners: Array<[ActorId, number | string | bigint]>;
  status: Status;
}

export interface Config {
  per_share: number | string | bigint;
  max_share: number;
}

export type Status = "idle" | "onGoing" | "completed";

export class LuckyDraw {
  public readonly registry: TypeRegistry;
  public readonly luckyDraw: LuckyDrawService;

  constructor(public api: GearApi, public programId?: `0x${string}`) {
    const types: Record<string, any> = {
      GameState: {
        "admin": "[u8;32]",
        "players": "Vec<[u8;32]>",
        "config": "Option<Config>",
        "winners": "Vec<([u8;32], u128)>",
        "status": "Status",
      },
      Config: { "per_share": "u128", "max_share": "u32" },
      Status: { "_enum": ["Idle", "OnGoing", "Completed"] },
    };

    this.registry = new TypeRegistry();
    this.registry.setKnownTypes({ types });
    this.registry.register(types);

    this.luckyDraw = new LuckyDraw(this);
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

export class LuckyDrawService {
  constructor(private _program: LuckyDraw) {}

  public claim(): TransactionBuilder<MessageId> {
    if (!this._program.programId) throw new Error("Program ID is not set");
    return new TransactionBuilder<MessageId>(
      this._program.api,
      this._program.registry,
      "send_message",
      ["LuckyDraw", "Claim"],
      "(String, String)",
      "[u8;32]",
      this._program.programId,
    );
  }

  public draw(): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error("Program ID is not set");
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      "send_message",
      ["LuckyDraw", "Draw"],
      "(String, String)",
      "Null",
      this._program.programId,
    );
  }

  public startGame(
    per_share: number | string | bigint,
    max_share: number,
  ): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error("Program ID is not set");
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      "send_message",
      ["LuckyDraw", "StartGame", per_share, max_share],
      "(String, String, u128, u32)",
      "Null",
      this._program.programId,
    );
  }

  public async gameState(
    originAddress?: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`,
  ): Promise<GameState> {
    const payload = this._program.registry.createType("(String, String)", [
      "LuckyDraw",
      "GameState",
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
      "(String, String, GameState)",
      reply.payload,
    );
    return result[2].toJSON() as unknown as GameState;
  }

  public subscribeToStartedEvent(
    callback: (data: { config: Config }) => void | Promise<void>,
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
          getServiceNamePrefix(payload) === "LuckyDraw" &&
          getFnNamePrefix(payload) === "Started"
        ) {
          callback(
            this._program.registry.createType(
              '(String, String, {"config":"Config"})',
              message.payload,
            )[2].toJSON() as unknown as { config: Config },
          );
        }
      },
    );
  }

  public subscribeToDepositedEvent(
    callback: (
      data: { who: ActorId; index: number; target: number },
    ) => void | Promise<void>,
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
          getServiceNamePrefix(payload) === "LuckyDraw" &&
          getFnNamePrefix(payload) === "Deposited"
        ) {
          callback(
            this._program.registry.createType(
              '(String, String, {"who":"[u8;32]","index":"u32","target":"u32"})',
              message.payload,
            )[2].toJSON() as unknown as {
              who: ActorId;
              index: number;
              target: number;
            },
          );
        }
      },
    );
  }

  public subscribeToCompletedEvent(
    callback: (data: null) => void | Promise<void>,
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
          getServiceNamePrefix(payload) === "LuckyDraw" &&
          getFnNamePrefix(payload) === "Completed"
        ) {
          callback(null);
        }
      },
    );
  }
}
