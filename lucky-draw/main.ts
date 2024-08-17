#!/usr/bin/env -S npx tsx

import { CounterProgram } from "./lib.ts";
import { GearApi, GearKeyring } from "@gear-js/api";
import { readFileSync } from "fs";

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
    "../target/wasm32-unknown-unknown/release/lucky_draw.opt.wasm",
  );

  /*
  console.log(wasm);
  console.log(counter);
  console.log(counter.newCtorFromCode);
  */

  let alice = await GearKeyring.fromSuri("//Alice");

  let tx = counter.newCtorFromCode(wasm).withAccount(alice, { nonce: -1 });

  console.log("tx:", { programId: tx.programId });

  /*
  console.log(api.blockGasLimit);
  console.log(api.blockGasLimit.toString());
  console.log(BigInt(api.blockGasLimit.toString()));
  */

  // let gas = (BigInt(api.blockGasLimit.toString()));
  // console.log("calculate");
  // await x.withGas(gas)
  // console.log(gas);

  await tx.calculateGas();

  let resp = await tx.signAndSend();
  console.log("resp:", resp);

  await resp.isFinalized;
  console.log("resp:", resp);
  console.log(await resp.response());

  counter.counter.subscribeToIncrementedEvent((data) => {
    console.log("event:", data);
  });

  while (true) {
    console.log(new Date(), "sending Inc");
    let tx = counter.counter.inc();
    tx.withAccount(alice, { nonce: -1 });
    await tx.calculateGas();
    await tx.signAndSend();
  }
}

main();
