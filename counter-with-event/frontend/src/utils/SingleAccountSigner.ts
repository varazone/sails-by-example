// Copyright 2017-2024 @polkadot/api authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { KeyringPair } from "@polkadot/keyring/types";
import type {
  Registry,
  SignerPayloadJSON,
  SignerPayloadRaw,
} from "@polkadot/types/types";
import type { Signer, SignerResult } from "@polkadot/api/types";

import { hexToU8a, objectSpread, u8aToHex } from "@polkadot/util";
import { decodeAddress, encodeAddress } from "@polkadot/keyring";

let id = 0;

const isAddressEqual = (a, b) =>
  encodeAddress(decodeAddress(a)) === encodeAddress(decodeAddress(b));

export class SingleAccountSigner implements Signer {
  readonly #keyringPair: KeyringPair;
  readonly #registry: Registry;
  readonly #signDelay: number;

  constructor(registry: Registry, keyringPair: KeyringPair, signDelay = 0) {
    this.#keyringPair = keyringPair;
    this.#registry = registry;
    this.#signDelay = signDelay;
  }

  public async signPayload(payload: SignerPayloadJSON): Promise<SignerResult> {
    if (!isAddressEqual(payload.address, this.#keyringPair.address)) {
      throw new Error("Signer does not have the keyringPair");
    }

    return new Promise((resolve): void => {
      setTimeout((): void => {
        const signed = this.#registry.createType("ExtrinsicPayload", payload, {
          version: payload.version,
        }).sign(this.#keyringPair);

        resolve(objectSpread({ id: ++id }, signed));
      }, this.#signDelay);
    });
  }

  public async signRaw(
    { address, data }: SignerPayloadRaw,
  ): Promise<SignerResult> {
    if (!isAddressEqual(address, this.#keyringPair.address)) {
      throw new Error("Signer does not have the keyringPair");
    }

    return new Promise((resolve): void => {
      setTimeout((): void => {
        const signature = u8aToHex(this.#keyringPair.sign(hexToU8a(data)));

        resolve({
          id: ++id,
          signature,
        });
      }, this.#signDelay);
    });
  }
}
