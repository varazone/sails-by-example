#!/usr/bin/env -S npx tsx

import { Sails, ZERO_ADDRESS } from "sails-js";
import { SailsIdlParser } from "sails-js-parser";
import { GearApi, GearKeyring, generateCodeHash } from "@gear-js/api";
import { postIDL } from "./postIDL.ts";
import {
  getCodeId,
  getIDL,
  getWASM,
  parseCliArgs,
  readConfig,
  writeConfig,
} from "./config.ts";

async function initGearApi() {
  return await GearApi.create({
    providerAddress: rpc,
  });
}

const { profile, rpc } = parseCliArgs();
console.log({ profile, rpc });

const config = readConfig();
const deploy = config.deploy;
console.log("profile:", profile);
console.log("deploy:", deploy);

const idl = getIDL(config, profile);
const wasm = getWASM(config, profile);
const codeId = getCodeId(config, profile);

const parser = await SailsIdlParser.new();
const sails = new Sails(parser);

sails.parseIdl(idl);

console.log("services:", sails.services);

const api = await initGearApi();
const alice = await GearKeyring.fromSuri("//Alice");
console.log("account:", alice.address);

api.setSigner(alice);
sails.setApi(api);

let tx = sails.ctors.New.fromCode(wasm, ...(deploy.args ?? [])).withAccount(
  alice,
  { nonce: -1 },
);
let programId = tx.programId;
console.log("tx:", { programId });

await tx.calculateGas();
let resp = await tx.signAndSend();
console.log("resp:", resp);

await resp.isFinalized;
console.log("resp(isFinalized):", resp);

let resps = await postIDL({ name: config.name, api, codeId, programId, idl });
console.log("resps:", resps);

config.deploy.idl = idl;
config.deploy.code_id = codeId;
config.deploy.program_id = programId;
config.deploy.rpc = rpc;
writeConfig(config);

process.exit(0);
