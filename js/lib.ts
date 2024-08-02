import { GearApi } from '@gear-js/api';
import { TypeRegistry } from '@polkadot/types';
import { TransactionBuilder } from 'sails-js';

export class Program {
  public readonly registry: TypeRegistry;
  public readonly ping: Ping;

  constructor(public api: GearApi, public programId?: `0x${string}`) {
    const types: Record<string, any> = {
    }

    this.registry = new TypeRegistry();
    this.registry.setKnownTypes({ types });
    this.registry.register(types);

    this.ping = new Ping(this);
  }

  newCtorFromCode(code: Uint8Array | Buffer): TransactionBuilder<null> {
    const builder = new TransactionBuilder<null>(
      this.api,
      this.registry,
      'upload_program',
      'New',
      'String',
      'String',
      code,
    );

    this.programId = builder.programId;
    return builder;
  }

  newCtorFromCodeId(codeId: `0x${string}`) {
    const builder = new TransactionBuilder<null>(
      this.api,
      this.registry,
      'create_program',
      'New',
      'String',
      'String',
      codeId,
    );

    this.programId = builder.programId;
    return builder;
  }
}

export class Ping {
  constructor(private _program: Program) {}

  public ping(): TransactionBuilder<boolean> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<boolean>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['Ping', 'Ping'],
      '(String, String)',
      'bool',
      this._program.programId
    );
  }
}