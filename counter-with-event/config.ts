import * as fs from "fs";
import * as path from "path";
import * as YAML from "yaml";
import { generateCodeHash } from "@gear-js/api";

import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

export function getConfigPath(): string {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  return resolve(__dirname, "config.yaml");
}

const CONFIG_PATH = getConfigPath();

export interface Config {
  name: string;
  basedir: string;
  basename: string;
  build: {
    release: {
      code_id: string;
    };
    debug: {
      code_id: string;
    };
  };
  deploy: {
    mainnet: {
      rpc: string;
      code_id: string;
      program_id: string;
    };
    testnet: {
      rpc: string;
      code_id: string;
      program_id: string;
    };
  };
}

export function getIDLPath(
  cfg: Config,
  profile: "release" | "debug" = "release",
) {
  return `${cfg.basedir}/${profile}/${cfg.basename}.idl`;
}

export function getIDL(cfg: Config, profile: "release" | "debug" = "release") {
  const idlPath = getIDLPath(cfg, profile);
  return fs.readFileSync(idlPath, "utf-8");
}

export function getWASMPath(
  cfg: Config,
  profile: "release" | "debug" = "release",
) {
  return `${cfg.basedir}/${profile}/${cfg.basename}.opt.wasm`;
}

export function getWASM(cfg: Config, profile: "release" | "debug" = "release") {
  const wasmPath = getWASMPath(cfg, profile);
  return fs.readFileSync(wasmPath);
}

export function getCodeId(
  cfg: Config,
  profile: "release" | "debug" = "release",
) {
  return generateCodeHash(getWASM(cfg, profile));
}

const defaultConfig: Config = {
  name: "app",
  basedir: "./target/wasm32-gear",
  basename: "app",
  build: {
    release: { code_id: "" },
    debug: { code_id: "" },
  },
  deploy: {
    mainnet: {
      code_id: "",
      program_id: "",
      rpc: "wss://rpc.vara.network",
    },
    testnet: {
      code_id: "",
      program_id: "",
      rpc: "wss://testnet.vara.network",
    },
  },
};

// Ensure file exists with defaults if not found
function ensureConfigFileExists(): void {
  if (!fs.existsSync(CONFIG_PATH)) {
    const yamlStr = YAML.stringify(defaultConfig);
    fs.writeFileSync(CONFIG_PATH, yamlStr, "utf8");
    console.log("Created config.yaml from template", readConfig());
  }
}

// Read config
export function readConfig(): Config {
  ensureConfigFileExists();
  const file = fs.readFileSync(CONFIG_PATH, "utf8");
  const raw = populateConfig(YAML.parse(file));
  return raw;
}

function populateConfig(cfg: Config): Config {
  for (let profile of ["debug", "release"]) {
    if (fs.existsSync(getWASMPath(cfg, profile))) {
      cfg.build[profile].code_id = getCodeId(cfg, profile);
    }
  }

  writeConfig(cfg);
  return cfg;
}

// Write config
export function writeConfig(config: Config): void {
  ensureConfigFileExists();
  const yamlStr = YAML.stringify(config);
  fs.writeFileSync(CONFIG_PATH, yamlStr, "utf8");
}
