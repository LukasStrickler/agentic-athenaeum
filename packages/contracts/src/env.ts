/**
 * Optional .env loader: tries current working directory first, then a
 * platform-standard global config directory. Does not overwrite existing
 * process.env. Requires Node 22.6+ (process.loadEnvFile); no-op on older Node.
 *
 * @see docs/environment-variables.md
 */

import os from "node:os";
import path from "node:path";

const GLOBAL_CONFIG_DIR_NAME = "agentic-athenaeum";

/**
 * Returns the path to the global .env file for the current platform.
 * - Windows: %APPDATA%\agentic-athenaeum\.env
 * - macOS / Linux: ~/.config/agentic-athenaeum/.env (XDG-style)
 */
export function getGlobalEnvPath(): string {
  if (process.platform === "win32") {
    const appData = process.env.APPDATA ?? path.join(os.homedir(), "AppData", "Roaming");
    return path.join(appData, GLOBAL_CONFIG_DIR_NAME, ".env");
  }
  const configHome = process.env.XDG_CONFIG_HOME ?? path.join(os.homedir(), ".config");
  return path.join(configHome, GLOBAL_CONFIG_DIR_NAME, ".env");
}

/**
 * Loads .env from the current working directory, then from the global config
 * directory if present. Existing process.env values are never overwritten.
 * Missing files are ignored. Call this at the start of skill action scripts.
 */
export function loadEnv(): void {
  const loadEnvFile =
    "loadEnvFile" in process && typeof process.loadEnvFile === "function"
      ? process.loadEnvFile
      : undefined;
  if (typeof loadEnvFile !== "function") {
    return;
  }
  const cwdEnv = path.join(process.cwd(), ".env");
  const globalEnv = getGlobalEnvPath();
  try {
    loadEnvFile(cwdEnv);
  } catch {
    // .env in cwd missing is normal (CI, or user relies on global/env only)
  }
  try {
    loadEnvFile(globalEnv);
  } catch {
    // Global .env missing is normal
  }
}
