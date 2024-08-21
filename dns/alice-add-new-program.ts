#!/usr/bin/env -S npx tsx

import { DnsProgram } from "./lib.ts";
import { Sails } from "sails-js";
import { decodeAddress, GearApi, GearKeyring } from "@gear-js/api";
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

async function addNewProgram(program, key, value) {
  const tx = program.dns.addNewProgram(key, value);
  await tx.calculateGas();
  return tx;
}

const randomKey = () => Math.random().toString();

const randomHex = () =>
  "0x" +
  [...Array(32)].map(() =>
    Math.floor(Math.random() * 256).toString(16).padStart(2, "0")
  ).join("");

async function main() {
  const { alice } = await initSigners();
  const api = await initGearApi();
  const programId =
    "0xd9e06730085547af856a83b0ca837227bbba86b4209895ec96e885cbfab56888";
  const program = new DnsProgram(api, programId);
  program.dns.subscribeToNewProgramAddedEvent((data) => {
    console.log("NewProgramAdded:", data);
  });
  console.log("alice:", decodeAddress(alice.address));
  const [key, value] = [randomKey(), randomHex()];
  const tx = await addNewProgram(program, key, value);
  const resp = await tx.withAccount(alice, { nonce: -1 }).signAndSend();
  await resp.isFinalized;
}

main().then(() => process.exit(0));
