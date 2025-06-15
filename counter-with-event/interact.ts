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
    providerAddress: deploy.rpc,
  });
}

const { network } = parseCliArgs();
console.log({ network });

const config = readConfig();
const deploy = config.deploy[network];
console.log("deploy:", deploy);

const parser = await SailsIdlParser.new();
const sails = new Sails(parser);

sails.parseIdl(deploy.idl);

console.log("services:", sails.services);

const api = await initGearApi();
const alice = await GearKeyring.fromSuri("//Alice");
console.log("account:", alice.address);

api.setSigner(alice);
sails.setApi(api);

sails.setProgramId(deploy.program_id);

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
