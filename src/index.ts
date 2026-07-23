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
    apiKey: parsed.values.apiKey || process.env.GROQ_API_KEY,
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

// API key validation is disabled during Phase 1.
// The validateKey Edge Function and api_keys/usage_events tables
// are deployed and ready — uncomment below to enable.
//
// async function validateApiKey(apiKey: string): Promise<void> {
//   const funcUrl = process.env.SUPABASE_FUNCTION_URL ||
//     "https://hvssbdhbyehhmbehrfjc.supabase.co/functions/v1/validate-key";
//   try {
//     const res = await fetch(funcUrl, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ apiKey }),
//     });
//     if (!res.ok) {
//       const body = await res.json().catch(() => ({}));
//       console.error(`API key validation failed: ${body.error || res.statusText}`);
//       return;
//     }
//     const body = await res.json();
//     if (body.valid) {
//       console.error(`Authenticated as user: ${body.user_id}`);
//     }
//   } catch (err) {
//     const message = err instanceof Error ? err.message : String(err);
//     console.error(`API key validation error: ${message}`);
//   }
// }

async function main(): Promise<void> {
  checkVersionChange();

  const cli = parseCliArgs();

  // API key validation skipped during Phase 1
  // if (cli.apiKey) {
  //   await validateApiKey(cli.apiKey);
  // }

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
