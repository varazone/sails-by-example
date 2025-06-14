#!/usr/bin/env -S npx tsx

import { ActorId, Sails, ZERO_ADDRESS } from "sails-js";
import { SailsIdlParser } from "sails-js-parser";
import fs from "fs/promises";
import { GearApi, GearKeyring, generateCodeHash } from "@gear-js/api";
import { postIDL } from "../counter-with-event/postIDL.ts";

if (process.argv.length <= 3) {
  console.error("Please provide <idl> <wasm> as an argument.");
  process.exit(1);
}

const PROVIDER = "wss://testnet.vara.network";

async function initGearApi() {
  return await GearApi.create({
    providerAddress: PROVIDER,
  });
}

const idlPath = process.argv[2];
const idl = await fs.readFile(idlPath, "utf-8");
const parser = await SailsIdlParser.new();
const sails = new Sails(parser);

sails.parseIdl(idl);

console.log(sails.services);

const wasmPath = process.argv[3];
const wasm = await fs.readFile(wasmPath);

const api = await initGearApi();
const alice = await GearKeyring.fromSuri("//Alice");
api.setSigner(alice);
sails.setApi(api);

let codeId = generateCodeHash(wasm);
console.log("wasm:", { codeId });

// console.log(sails)
let tx = sails.ctors.New.fromCode(wasm).withAccount(alice, { nonce: -1 });
let programId = tx.programId;
console.log("tx:", { programId });

await tx.calculateGas();
let resp = await tx.signAndSend();
console.log("resp:", resp);

await resp.isFinalized;
console.log("resp(isFinalized):", resp);

let resps = await postIDL({ name: "test", api, codeId, programId, idl });
console.log("resps:", resps);

let my_ss58_address = await sails.services.Ss58.queries.MySs58Address(
  alice.address,
);
console.log({ my_ss58_address });
let ss58_to_actor_id = await sails.services.Ss58.queries.Ss58ToActorId(
  alice.address,
  null,
  null,
  "kGg6cdo1RpgbEu4xWDrC2n5MDh8BfmYxEyzSpBYhXuuQ3V9a1",
);
console.log({ ss58_to_actor_id });
// OK
// let actor_id_to_ss58 = await sails.services.Ss58.queries.ActorIdToSs58(alice.address, null, null, programId, {"Custom": 137});

// OK
let actor_id_to_ss58 = await sails.services.Ss58.queries.ActorIdToSs58(
  alice.address,
  null,
  null,
  programId,
  { Vara: null },
);

// let actor_id_to_ss58 = await sails.services.Ss58.queries.ActorIdToSs58(alice.address, null, null, programId, "Vara");

console.log({ actor_id_to_ss58 });
