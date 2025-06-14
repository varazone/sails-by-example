#!/usr/bin/env -S npx tsx

import { Sails, ZERO_ADDRESS } from "sails-js";
import { SailsIdlParser } from "sails-js-parser";
import { GearApi, GearKeyring, generateCodeHash } from "@gear-js/api";
import { postIDL } from "./postIDL.ts";
import {
  getCodeId,
  getIDL,
  getWASM,
  readConfig,
  writeConfig,
} from "./config.ts";

async function initGearApi() {
  return await GearApi.create({
    providerAddress: deploy.rpc,
  });
}

const DEFAULT_PROFILE = process.env.PROFILE || "release"; // "debug"
const DEFAULT_NETWORK = process.env.NETWORK || "testnet"; // "mainnet"

function parseArgs() {
  let profile = DEFAULT_PROFILE;
  let network = DEFAULT_NETWORK;
  switch (process.argv.length) {
    case 0:
    case 1:
      console.error("Please provide <profile> <network> as an argument.");
      process.exit(1);
    case 2:
      break;
    case 3:
      profile = process.argv[2];
      break;
    case 4:
    default:
      profile = process.argv[2];
      network = process.argv[3];
  }
  return { profile, network };
}

const { profile, network } = parseArgs();

const config = readConfig();
const deploy = config.deploy[network];
console.log("deploy:", deploy);

const idl = getIDL(config, profile);
const wasm = getWASM(config, profile);
const codeId = getCodeId(config, profile);

const reuse = deploy.code_id == codeId && !!deploy.program_id;
console.log("reuse:", reuse);

const parser = await SailsIdlParser.new();
const sails = new Sails(parser);

sails.parseIdl(idl);

console.log("services:", sails.services);

const api = await initGearApi();
const alice = await GearKeyring.fromSuri("//Alice");
console.log("account:", alice.address);

api.setSigner(alice);
sails.setApi(api);

if (reuse) {
  sails.setProgramId(deploy.program_id);
} else {
  let tx = sails.ctors.New.fromCode(wasm).withAccount(alice, { nonce: -1 });
  let programId = tx.programId;
  console.log("tx:", { programId });

  await tx.calculateGas();
  let resp = await tx.signAndSend();
  console.log("resp:", resp);

  await resp.isFinalized;
  console.log("resp(isFinalized):", resp);

  let resps = await postIDL({ name: config.name, api, codeId, programId, idl });
  console.log("resps:", resps);

  config.deploy[network].code_id = codeId;
  config.deploy[network].program_id = programId;
  writeConfig(config);
}

sails.services.Counter.events.IncrementedTo.subscribe(async (data) => {
  console.log("event:", data);

  let value = await sails.services.Counter.queries.Get(ZERO_ADDRESS);
  console.log("value:", value);
});

while (1) {
  console.log(new Date(), "sending Inc");
  let tx = sails.services.Counter.functions.Inc();
  tx.withAccount(alice, { nonce: -1 });
  await tx.calculateGas();
  await tx.signAndSend();
}
