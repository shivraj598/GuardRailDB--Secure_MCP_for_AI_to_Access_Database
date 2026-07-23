import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getPool } from "../db/pool.js";
import { getEffectiveLimit } from "../utils/pagination.js";

const QueryArgs = {
  query: z.string().min(1, "Query must not be empty").describe("SELECT SQL query to execute"),
  params: z.array(z.unknown()).optional().describe("Query parameter values"),
  limit: z
    .number()
    .int()
    .positive()
    .max(50)
    .optional()
    .describe("Max rows (capped at 50)"),
};

export function registerQueryTool(server: McpServer): void {
  server.tool(
    "execute_query",
    "Execute a validated SELECT query with hard server-side pagination (max 50 rows).",
    QueryArgs,
    async ({ query, params, limit }) => {
      const effectiveLimit = getEffectiveLimit(limit);

      try {
        const pool = getPool();
        const wrapped = `SELECT * FROM (${query}) AS _sub LIMIT ${effectiveLimit}`;
        const result = await pool.query(wrapped, params ?? []);
        const truncated = result.rows.length >= effectiveLimit;

        const rows = result.rows.map((r: Record<string, unknown>) =>
          JSON.stringify(r, null, 2)
        );

        const summary = [
          `**${result.rows.length} row(s)** returned${truncated ? ` (capped at ${effectiveLimit})` : ""}.`,
          result.rowCount !== null ? `Total: ${result.rowCount} rows.` : "",
        ]
          .filter(Boolean)
          .join(" ");

        return {
          content: [
            { type: "text", text: summary },
            { type: "text", text: rows.join("\n") || "(empty result set)" },
          ],
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return {
          content: [{ type: "text", text: `Query failed: ${message}` }],
          isError: true,
        };
      }
    }
  );
}
