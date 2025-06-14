#!/usr/bin/env -S npx -y tsx

import {
  getCodeId,
  getIDL,
  getWASM,
  readConfig,
  writeConfig,
} from "./config.ts";

let config = readConfig();
console.log(config);
console.log(getIDL(config));
console.log(getWASM(config));
console.log(getCodeId(config));
