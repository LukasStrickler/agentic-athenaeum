"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// dev/placeholder-two/scripts/echo.ts
var import_node_fs = require("node:fs");

// packages/contracts/src/env.ts
var import_node_os = __toESM(require("node:os"));
var import_node_path = __toESM(require("node:path"));
var GLOBAL_CONFIG_DIR_NAME = "agentic-athenaeum";
function getGlobalEnvPath() {
  if (process.platform === "win32") {
    const appData = process.env.APPDATA ?? import_node_path.default.join(import_node_os.default.homedir(), "AppData", "Roaming");
    return import_node_path.default.join(appData, GLOBAL_CONFIG_DIR_NAME, ".env");
  }
  const configHome = process.env.XDG_CONFIG_HOME ?? import_node_path.default.join(import_node_os.default.homedir(), ".config");
  return import_node_path.default.join(configHome, GLOBAL_CONFIG_DIR_NAME, ".env");
}
function loadEnv() {
  const loadEnvFile = "loadEnvFile" in process && typeof process.loadEnvFile === "function" ? process.loadEnvFile : void 0;
  if (typeof loadEnvFile !== "function") {
    return;
  }
  const cwdEnv = import_node_path.default.join(process.cwd(), ".env");
  const globalEnv = getGlobalEnvPath();
  try {
    loadEnvFile(cwdEnv);
  } catch {
  }
  try {
    loadEnvFile(globalEnv);
  } catch {
  }
}

// packages/contracts/src/study-material.ts
var normalizeInputText = (value) => {
  const cleaned = value.trim();
  return cleaned.length > 0 ? cleaned : "No source content provided.";
};

// dev/placeholder-two/scripts/echo.ts
loadEnv();
var args = process.argv.slice(2);
var input = "No input provided";
var output = "";
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--input" && args[i + 1]) {
    input = args[i + 1];
    i++;
  } else if (args[i] === "--output" && args[i + 1]) {
    output = args[i + 1];
    i++;
  }
}
var content = `# Placeholder Two Output

Input: ${normalizeInputText(input)}
`;
if (output) {
  (0, import_node_fs.writeFileSync)(output, content);
  console.log(`[placeholder-two] Wrote to ${output}`);
} else {
  console.log(content);
}
process.exit(0);
