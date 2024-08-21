#!/usr/bin/env -S deno run -A

// #!/usr/bin/env -S npx tsx

import { LuckyDrawProgram } from "./lib.ts";
import { Sails } from "sails-js";
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

async function loadWasm() {
  const wasmPath =
    "../target/wasm32-unknown-unknown/release/lucky_draw.opt.wasm";
  const wasm = await Deno.readFile(wasmPath);

  return {
    wasmPath,
    wasm,
  };
}

async function parseArgs() {
  if (Deno.args.length < 2) {
    console.error("Please provide <idl> <wasm> as an argument.");
    Deno.exit(1);
  }

  const idlPath = Deno.args[0];
  const wasmPath = Deno.args[1];
  const idl = await Deno.readTextFile(idlPath);
  const wasm = await Deno.readFile(wasmPath);

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

async function deployProgram(program, wasm, alice) {
  let tx = program.newCtorFromCode(wasm).withAccount(alice, { nonce: -1 });
  console.log("tx:", { programId: tx.programId });

  await tx.calculateGas();
  let resp = await tx.signAndSend();
  console.log("resp:", resp);

  await resp.isFinalized;
  console.log("resp:", resp);
  return tx.programId;
}

async function main() {
  // const { idl, wasm } = await parseArgs();
  // const { idl, wasm } = await parseProgramArgs();
  const { wasm } = await loadWasm();
  // const sails = await initSails(idl);
  // console.log(sails.services);
  const { alice, bob } = await initSigners();
  const api = await initGearApi();
  api.setSigner(alice);
  // sails.setApi(api);
  // console.log(sails)
  const program = new LuckyDrawProgram(api);

  await deployProgram(program, wasm, alice);

  program.luckyDraw.subscribeToStartedEvent((data) => {
    console.log("Started:", data);
  });
  program.luckyDraw.subscribeToDepositedEvent((data) => {
    console.log("Deposited:", data);
  });
  program.luckyDraw.subscribeToCompletedEvent((data) => {
    console.log("Completed:", data);
  });

  while (1) {
    console.log(new Date(), "StartGame");
    {
      let tx = program.luckyDraw.startGame(1000000000000n, 1);
      tx.withAccount(alice, { nonce: -1 });
      await tx.calculateGas();
      await tx.signAndSend();
    }

    console.log(new Date(), "Draw");
    {
      let tx = program.luckyDraw.draw();
      tx.withAccount(alice, { nonce: -1 });
      tx.withValue(1000000000000n);
      await tx.calculateGas();
      await tx.signAndSend();
    }

    console.log(new Date(), "GameState");
    {
      // console.log(alice, alice.address);
      let gameState = await program.luckyDraw.gameState(
        alice.address,
      );
      console.log("GameState:", gameState);
    }

    console.log(new Date(), "StartGame");
    {
      let tx = program.luckyDraw.startGame(1000000000000n, 2);
      tx.withAccount(alice, { nonce: -1 });
      await tx.calculateGas();
      await tx.signAndSend();
    }

    console.log(new Date(), "Draw");
    {
      let tx = program.luckyDraw.draw();
      tx.withAccount(alice, { nonce: -1 });
      tx.withValue(1000000000000n);
      await tx.calculateGas();
      await tx.signAndSend();
    }

    console.log(new Date(), "Draw");
    {
      let tx = program.luckyDraw.draw();
      tx.withAccount(bob, { nonce: -1 });
      tx.withValue(1000000000000n);
      await tx.calculateGas();
      await tx.signAndSend();
    }

    console.log(new Date(), "GameState");
    {
      // console.log(alice, alice.address);
      let gameState = await program.luckyDraw.gameState(
        alice.address,
      );
      console.log("GameState:", gameState);
    }

    console.log(new Date(), "Claim");
    {
      let tx = program.luckyDraw.claim();
      tx.withAccount(alice, { nonce: -1 });
      await tx.calculateGas();
      let { response, isFinalized } = await tx.signAndSend();
      console.log("response:", await response());
      await isFinalized;
    }
  }
}

main();
