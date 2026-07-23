import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerSchemaTool } from "../tools/schema.js";
import { registerQueryTool } from "../tools/query.js";
import { registerSimulateTool } from "../tools/simulate.js";
import { readPackageVersion } from "../utils/version-check.js";

export async function createAndStartServer(): Promise<void> {
  const version = readPackageVersion();

  const server = new McpServer(
    {
      name: "db-guardrail-mcp",
      version,
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  registerSchemaTool(server);
  registerQueryTool(server);
  registerSimulateTool(server);

  const transport = new StdioServerTransport();
  await server.connect(transport);
}
