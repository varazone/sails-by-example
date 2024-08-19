#!/usr/bin/env -S node

import { Sails } from "sails-js";
import fs from "fs/promises";
import { GearApi, GearKeyring } from "@gear-js/api";

async function initGearApi() {
  const PROVIDER = "wss://testnet.vara.network";
  return await GearApi.create({
    providerAddress: PROVIDER,
  });
}

async function initSigners() {
  const alice = await GearKeyring.fromSuri("//Alice");
  const bob = await GearKeyring.fromSuri("//Bob");
  return { alice, bob };
}

async function parseArgs() {
  if (process.argv.length <= 3) {
    console.error("Please provide <idl> <wasm> as an argument.");
    process.exit(1);
  }
  const idlPath = process.argv[2];
  const wasmPath = process.argv[3];
  const idl = await fs.readFile(idlPath, "utf-8");
  const wasm = await fs.readFile(wasmPath);

  return {
    idlPath,
    wasmPath,
    idl,
    wasm,
  };
}

async function initSails(idl) {
  const sails = await Sails.new();
  sails.parseIdl(idl);
  return sails;
}

async function deploy(sails, wasm, alice) {
  let tx = sails.ctors.New.fromCode(wasm).withAccount(alice, { nonce: -1 });
  console.log("tx:", { programId: tx.programId });

  await tx.calculateGas();
  let resp = await tx.signAndSend();
  console.log("resp:", resp);

  await resp.isFinalized;
  console.log("resp:", resp);
  return tx.programId;
}

async function main() {
  const { idl, wasm } = await parseArgs();
  const sails = await initSails(idl);
  // console.log(sails.services);
  const { alice, bob } = await initSigners();
  const api = await initGearApi();
  api.setSigner(alice);
  sails.setApi(api);
  // console.log(sails)

  await deploy(sails, wasm, alice);

  sails.services.LuckyDraw.events.Started.subscribe((data) => {
    console.log("Started:", data);
  });
  sails.services.LuckyDraw.events.Deposited.subscribe((data) => {
    console.log("Deposited:", data);
  });
  sails.services.LuckyDraw.events.Completed.subscribe((data) => {
    console.log("Completed:", data);
  });
  // sails.services.LuckyDraw.events.Debug.subscribe((data) => {
  //   console.log("Debug:", data);
  // });

  while (1) {
    console.log(new Date(), "StartGame");
    {
      let tx = sails.services.LuckyDraw.functions.StartGame(1000000000000n, 1);
      tx.withAccount(alice, { nonce: -1 });
      await tx.calculateGas();
      await tx.signAndSend();
    }

    console.log(new Date(), "Draw");
    {
      let tx = sails.services.LuckyDraw.functions.Draw();
      tx.withAccount(alice, { nonce: -1 });
      tx.withValue(1000000000000n);
      await tx.calculateGas();
      await tx.signAndSend();
    }

    console.log(new Date(), "GameState");
    {
      // console.log(alice, alice.address);
      let gameState = await sails.services.LuckyDraw.queries.GameState(
        alice.address,
      );
      console.log("GameState:", gameState);
    }

    console.log(new Date(), "StartGame");
    {
      let tx = sails.services.LuckyDraw.functions.StartGame(1000000000000n, 2);
      tx.withAccount(alice, { nonce: -1 });
      await tx.calculateGas();
      await tx.signAndSend();
    }

    console.log(new Date(), "Draw");
    {
      let tx = sails.services.LuckyDraw.functions.Draw();
      tx.withAccount(alice, { nonce: -1 });
      tx.withValue(1000000000000n);
      await tx.calculateGas();
      await tx.signAndSend();
    }

    console.log(new Date(), "Draw");
    {
      let tx = sails.services.LuckyDraw.functions.Draw();
      tx.withAccount(bob, { nonce: -1 });
      tx.withValue(1000000000000n);
      await tx.calculateGas();
      await tx.signAndSend();
    }

    console.log(new Date(), "GameState");
    {
      // console.log(alice, alice.address);
      let gameState = await sails.services.LuckyDraw.queries.GameState(
        alice.address,
      );
      console.log("GameState:", gameState);
    }

    console.log(new Date(), "Claim");
    {
      let tx = sails.services.LuckyDraw.functions.Claim();
      tx.withAccount(alice, { nonce: -1 });
      await tx.calculateGas();
      let { response, isFinalized } = await tx.signAndSend();
      console.log("response:", await response());
      await isFinalized;
    }
  }
}

main();
