#!/usr/bin/env -S npx tsx

import { DnsProgram } from "./lib.ts";
import { Sails } from "sails-js";
import { decodeAddress, GearApi, GearKeyring } from "@gear-js/api";
import { Keyring } from "@polkadot/keyring";
import { readFile } from "fs/promises";
import {
  createKeyMulti,
  encodeAddress,
  sortAddresses,
} from "@polkadot/util-crypto";

async function initGearApi() {
  const PROVIDER = "wss://testnet.vara.network";
  const api = await GearApi.create({
    providerAddress: PROVIDER,
  });
  await api.isReady;
  return api;
}

async function initSigners() {
  const alice = await GearKeyring.fromSuri("//Alice");
  const bob = await GearKeyring.fromSuri("//Bob");
  return { alice, bob };
}

async function parseArgs(args: string[]) {
  if (args.length < 2) {
    console.error("Please provide <idl> <wasm> as an argument.");
    process.exit(1);
  }

  const idlPath = args[0];
  const wasmPath = args[1];
  const idl = await readFile(idlPath, "utf-8");
  const wasm = await readFile(wasmPath);

  return {
    idlPath,
    wasmPath,
    idl,
    wasm,
  };
}

async function addNewProgram(program, key, value) {
  const tx = program.dns.addNewProgram(key, value);
  // await tx.calculateGas();
  await tx.withGas(100000000000n);
  return tx;
}

const randomKey = () => Math.random().toString();

const randomHex = () =>
  "0x" +
  [...Array(32)].map(() =>
    Math.floor(Math.random() * 256).toString(16).padStart(2, "0")
  ).join("");

async function sendAndFinalize(api, tx, signer) {
  return new Promise((resolve, reject) => {
    tx.signAndSend(signer, { nonce: -1 }, ({ status, dispatchError }) => {
      if (status.isFinalized) {
        if (dispatchError) {
          // reject(new Error(dispatchError.toString()));
          if (dispatchError.isModule) {
            const decoded = api.registry.findMetaError(dispatchError.asModule);
            const { docs, name, section } = decoded;
            reject(new Error(`${section}.${name}: ${docs.join(" ")}`));
          } else {
            reject(new Error(dispatchError.toString()));
          }
        } else {
          resolve(status.asFinalized);
        }
      }
    }).catch(reject);
  });
}

async function sendAndFinalizeAsMulti(api, tx, alice, bob) {
  const multiTx = api.tx.multisig.asMultiThreshold1([bob.address], tx);
  return sendAndFinalize(api, multiTx, alice);
}

function OneOfTwoMultisig(api, alice, bob) {
  // Create the 1/2 multisig
  const threshold = 1;
  const signatories = [alice.address, bob.address];
  const multiAddress = createKeyMulti(signatories, threshold);

  return decodeAddress(encodeAddress(multiAddress));
}

async function main() {
  const { alice, bob } = await initSigners();
  const api = await initGearApi();
  const programId =
    "0xd9e06730085547af856a83b0ca837227bbba86b4209895ec96e885cbfab56888";
  const program = new DnsProgram(api, programId);
  program.dns.subscribeToNewProgramAddedEvent((data) => {
    console.log("NewProgramAdded:", data);
  });
  const [key, value] = [randomKey(), randomHex()];
  const tx = await addNewProgram(program, key, value);
  const aliceBobMultiAddress = OneOfTwoMultisig(api, alice, bob);
  console.log("aliceBobMultiAddress:", aliceBobMultiAddress);
  await sendAndFinalizeAsMulti(api, tx.extrinsic, alice, bob);
}

main().then(() => process.exit(0));
