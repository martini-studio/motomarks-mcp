#!/usr/bin/env node
import { fileURLToPath } from "node:url";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ConfigError, loadConfig, redactText, type MotomarksConfig } from "./config.js";
import { createMotomarksMcpServer } from "./server.js";

export type { MotomarksConfig } from "./config.js";
export { ConfigError, loadConfig, redactText, sanitizeApiToken } from "./config.js";
export { MotomarksClient, MotomarksApiError } from "./motomarks-client.js";
export {
  createMotomarksMcpServer,
  type MotomarksMcpServer,
  type MotomarksMcpServerOptions,
} from "./server.js";

export async function main(): Promise<void> {
  const config = loadConfig();
  const { server } = createMotomarksMcpServer(config);

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

function isCliEntrypoint(): boolean {
  return process.argv[1] === fileURLToPath(import.meta.url);
}

function handleStartupError(error: unknown, config?: Partial<MotomarksConfig>): never {
  const message = error instanceof Error ? error.message : String(error);
  const status = error instanceof ConfigError ? "Configuration error" : "Motomarks MCP server failed";
  console.error(`${status}: ${redactText(message, config)}`);
  process.exit(1);
}

if (isCliEntrypoint()) {
  main().catch((error) => handleStartupError(error));
}
