import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getPool } from "../db/pool.js";

const SimulateArgs = {
  query: z.string().min(1).describe("SQL query to simulate (will be rolled back)"),
  params: z.array(z.unknown()).optional().describe("Query parameter values"),
};

export function registerSimulateTool(server: McpServer): void {
  server.tool(
    "simulate_query",
    "Run a SQL query inside a sandboxed transaction that is immediately rolled back — zero risk to persistent data.",
    SimulateArgs,
    async ({ query, params }) => {
      const pool = getPool();
      const client = await pool.connect();

      try {
        await client.query("BEGIN");
        const result = await client.query(query, params ?? []);
        await client.query("ROLLBACK");

        const rows = result.rows.map((r: Record<string, unknown>) =>
          JSON.stringify(r, null, 2)
        );

        return {
          content: [
            {
              type: "text",
              text: [
                "**SIMULATION** — query was rolled back. No changes were persisted.",
                "",
                `Rows returned: ${result.rows.length}`,
                `Rows affected: ${result.rowCount ?? "unknown"}`,
              ].join("\n"),
            },
            { type: "text", text: rows.join("\n") || "(empty result set)" },
          ],
        };
      } catch (err) {
        await client.query("ROLLBACK").catch(() => {});
        const message = err instanceof Error ? err.message : String(err);
        return {
          content: [{ type: "text", text: `Simulation failed: ${message}` }],
          isError: true,
        };
      } finally {
        client.release();
      }
    }
  );
}
