#!/usr/bin/env -S npx tsx

import { Sails } from 'sails-js';
import { SailsIdlParser } from 'sails-js-parser';
import { IDL, PROGRAM_ID } from './src/lib/counter.js';

const parser = await SailsIdlParser.new();
const sails = new Sails(parser);

sails.parseIdl(IDL);
sails.setProgramId(PROGRAM_ID);

console.log(sails);
