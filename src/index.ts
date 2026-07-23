import "dotenv/config";
import { connectPool, closePool } from "./db/pool.js";
import { createAndStartServer } from "./mcp/server.js";
import { checkVersionChange } from "./utils/version-check.js";
import { parseArgs } from "node:util";

interface CliArgs {
  connectionString: string;
  apiKey?: string;
}

function parseCliArgs(): CliArgs {
  const args = process.argv.slice(2);
  const options = {
    connectionString: { type: "string" as const, short: "c" },
    apiKey: { type: "string" as const, short: "k" },
  };

  let parsed: { values: Record<string, string | undefined> };
  try {
    parsed = parseArgs({ args, options, allowPositionals: false });
  } catch {
    printUsage();
    process.exit(1);
  }

  const connectionString =
    parsed.values.connectionString || process.env.DATABASE_URL;

  if (!connectionString) {
    console.error("Error: --connectionString or DATABASE_URL environment variable is required.");
    printUsage();
    process.exit(1);
  }

  return {
    connectionString,
    apiKey: parsed.values.apiKey,
  };
}

function printUsage(): void {
  console.error(`
Usage: db-guardrail-mcp --connectionString=<postgresql://...> [--apiKey=<key>]

Options:
  --connectionString, -c  PostgreSQL connection string (or set DATABASE_URL env)
  --apiKey, -k            API key for access gating (optional in Phase 1)
`);
}

async function main(): Promise<void> {
  checkVersionChange();

  const cli = parseCliArgs();

  try {
    await connectPool(cli.connectionString);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`Failed to connect to database: ${message}`);
    process.exit(1);
  }

  process.on("SIGINT", async () => {
    await closePool();
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    await closePool();
    process.exit(0);
  });

  try {
    await createAndStartServer();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`Server error: ${message}`);
    await closePool();
    process.exit(1);
  }
}

main().catch(async (err) => {
  console.error("Unhandled error:", err);
  await closePool();
  process.exit(1);
});
