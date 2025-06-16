import yargs from "yargs";
import { hideBin } from "yargs/helpers";

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

const DEFAULT_PROFILE = process.env.PROFILE || "release"; // "debug"

export function parseCliArgs(): {
  profile: "release" | "debug";
  rpc: string;
} {
  const argv = yargs(hideBin(process.argv))
    .usage("$0 [options]")
    .option("rpc", {
      type: "string",
      description:
        "Use alternative rpc (default is wss://testnet.vara.network)",
      default: "wss://testnet.vara.network",
    })
    .option("release", {
      alias: "r",
      type: "boolean",
      description: "Use release profile (default is debug)",
      default: false,
    })
    .help()
    .parseSync();

  const profile = argv.release ? "release" : "debug";
  const rpc = argv.rpc ?? "wss://testnet.vara.network";

  return { profile, rpc };
}

const CONFIG_PATH = getConfigPath();

export interface Config {
  name: string;
  basedir: string;
  basename: string;
  build: {
    debug: { code_id: string };
    release: { code_id: string };
  };
  deploy: {
    rpc: string;
    idl: string;
    args: any[];
    code_id: string;
    program_id: string;
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
    debug: {
      code_id: "",
    },
    release: {
      code_id: "",
    },
  },
  deploy: {
    rpc: "wss://testnet.vara.network",
    idl: "",
    args: [],
    code_id: "",
    program_id: "",
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
