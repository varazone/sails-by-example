import { Sails } from "sails-js";
import fs from "fs/promises";
import { GearApi, GearKeyring } from "@gear-js/api";

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
const sails = await Sails.new();

sails.parseIdl(idl);

console.log(sails.services);

const wasmPath = process.argv[3];
const wasm = await fs.readFile(wasmPath);

const api = await initGearApi();
const alice = await GearKeyring.fromSuri("//Alice");
api.setSigner(alice);
sails.setApi(api);

// console.log(sails)
let tx = sails.ctors.New.fromCode(wasm).withAccount(alice, { nonce: -1 });

await tx.calculateGas();
console.log(await tx.signAndSend());
console.log(tx.programId);

sails.services.Counter.events.Incremented.subscribe((data) => {
  console.log(data);
});

while (1) {
  console.log(new Date());
  let tx = sails.services.Counter.functions.Inc();
  tx.withAccount(alice, { nonce: -1 });
  await tx.calculateGas();
  await tx.signAndSend();
}
