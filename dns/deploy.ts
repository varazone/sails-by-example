#!/usr/bin/env -S npx tsx

import { DnsProgram } from "./lib.ts";
import { Sails } from "sails-js";
import { GearApi, GearKeyring } from "@gear-js/api";
import { readFile } from "fs/promises";

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

async function deployProgram(program, wasm, alice) {
  const tx = program.newCtorFromCode(wasm).withAccount(alice, { nonce: -1 });
  await tx.calculateGas();
  return tx;
}

async function main() {
  const { idl, wasm } = await parseArgs(process.argv.slice(2));
  const { alice } = await initSigners();
  const api = await initGearApi();
  const program = new DnsProgram(api);
  const tx = await deployProgram(program, wasm, alice);
  const resp = await tx.signAndSend();
  await resp.isFinalized;
  console.log("programId:", tx.programId);
}

main().then(() => process.exit(0));
