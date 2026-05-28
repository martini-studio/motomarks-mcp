import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { MotomarksConfig } from "./config.js";
import { MotomarksClient } from "./motomarks-client.js";
import { registerPrompts } from "./prompts/index.js";
import { registerResources } from "./resources/docs.js";
import { registerTools } from "./tools/index.js";

export interface MotomarksMcpServerOptions {
  client?: MotomarksClient;
}

export interface MotomarksMcpServer {
  server: McpServer;
  client: MotomarksClient;
}

export function createMotomarksMcpServer(
  config: MotomarksConfig,
  options: MotomarksMcpServerOptions = {},
): MotomarksMcpServer {
  const client = options.client ?? new MotomarksClient(config);
  const server = new McpServer({
    name: "motomarks-mcp",
    version: "0.1.1",
  });

  registerTools(server, client, config);
  registerResources(server, client, config);
  registerPrompts(server);

  return { server, client };
}
