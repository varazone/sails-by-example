#!/usr/bin/env -S deno run -A

import { Sails } from 'sails-js';
import { SailsIdlParser } from "sails-js-parser";

if (Deno.args.length < 1) {
    console.error("Please provide a file path as an argument.");
    Deno.exit(1);
}

const idlPath = Deno.args[0];
const idl = await Deno.readTextFile(idlPath);
const parser = await SailsIdlParser.new()
const sails = new Sails(parser);

sails.parseIdl(idl);

console.log("ctors:", sails.ctors)
console.log("services:", sails.services)
