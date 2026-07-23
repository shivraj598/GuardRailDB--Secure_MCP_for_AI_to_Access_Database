import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getCompactSchema } from "../utils/schema-compactor.js";

const SchemaArgs = {
  schema: z
    .string()
    .optional()
    .describe("Optional schema filter (defaults to all user schemas)"),
};

export function registerSchemaTool(server: McpServer): void {
  server.tool(
    "get_schema",
    "Retrieve a compact, LLM-readable Markdown summary of the database schema — includes tables, columns, types, nullability, and primary keys.",
    SchemaArgs,
    async ({ schema }) => {
      try {
        const result = await getCompactSchema(schema);
        return {
          content: [{ type: "text", text: result }],
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return {
          content: [{ type: "text", text: `Failed to retrieve schema: ${message}` }],
          isError: true,
        };
      }
    }
  );
}
