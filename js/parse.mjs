import { Sails } from 'sails-js';
import fs from 'fs/promises';

if (process.argv.length <= 2) {
    console.error("Please provide a file path as an argument.");
    process.exit(1);
}

const idlPath = process.argv[2];
const idl = await fs.readFile(idlPath, 'utf-8');
const sails = await Sails.new();

sails.parseIdl(idl);

console.log(sails.services)