#!/usr/bin/env -S npx tsx

import { CounterProgram } from "./lib.ts";
import { GearApi, GearKeyring } from "@gear-js/api";
import { readFileSync } from "fs";

console.log("abc");

const PROVIDER = "wss://testnet.vara.network";

async function initGearApi() {
  return await GearApi.create({
    providerAddress: PROVIDER,
  });
}

async function main() {
  let api = await initGearApi();

  let counter = new CounterProgram(api);

  let wasm = readFileSync(
    "../target/wasm32-gear/release/counter.opt.wasm",
  );

  console.log(wasm);
  console.log(counter);
  console.log(counter.newCtorFromCode);

  let alice = await GearKeyring.fromSuri("//Alice");

  let x = counter.newCtorFromCode(wasm).withAccount(alice).withValue(0n);

  console.log(x);

  /*
  console.log(api.blockGasLimit);
  console.log(api.blockGasLimit.toString());
  console.log(BigInt(api.blockGasLimit.toString()));
  */

  // let gas = (BigInt(api.blockGasLimit.toString()));
  console.log("calculate");
  // await x.calculateGas();
  // await x.withGas(gas)
  x.withGas('max')
  console.log(x.gasInfo);

  let resp = await x.signAndSend();

  console.log({ done: resp });
  await resp.isFinalized;
  console.log({ done: resp });
  console.log(await resp.response());
}

main();
