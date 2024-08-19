#!/usr/bin/env -S deno run -A

import { Sails } from 'sails-js';

if (Deno.args.length < 1) {
    console.error("Please provide a file path as an argument.");
    Deno.exit(1);
}

const idlPath = Deno.args[0];
const idl = await Deno.readTextFile(idlPath);
const sails = await Sails.new();

sails.parseIdl(idl);

console.log(sails.services)
