# GuardRailDB — Secure MCP for AI Database Access

A secure, schema-aware [Model Context Protocol (MCP)](https://modelcontextprotocol.io) gateway for Postgres databases. Lets LLMs and AI agents query your database without executing raw unconstrained SQL, blowing up context windows, or risking destructive changes.

![Home page](screenshots/docs-v2.png)

## Quickstart

```bash
npx db-guardrail-mcp --connectionString=postgresql://user:pass@localhost:5432/mydb
```

Point any MCP-compatible client (Claude Desktop, Cursor, etc.) at the running process and it gets safe, schema-aware, paginated access to your Postgres database.

## Architecture

- **Protocol**: Native MCP (JSON-RPC 2.0) via `@modelcontextprotocol/sdk`
- **Transport**: stdio — server runs as a local child process
- **Security**: All data stays local; only API key validation contacts hosted infrastructure
- **Stack**: Node.js, TypeScript, `pg` (node-postgres), Zod

## Exposed Tools

| Tool | Description |
|------|-------------|
| `get_schema` | Returns a compact Markdown summary of the database schema |
| `execute_query` | Runs a validated SELECT query with hard 50-row pagination |
| `simulate_query` | Runs a query inside a transaction and rolls it back — zero risk |

## Features

- **Schema Compacting** — Queries `information_schema` and compresses it into dense, LLM-readable Markdown
- **Strict Input Validation** — Every tool call is validated against a Zod schema before execution
- **Hard Pagination** — Record requests capped at 50 rows server-side
- **Sandboxed Simulation** — Mutating queries run in a `BEGIN` / `ROLLBACK` transaction with zero risk

## Documentation Site

The docs site is built with React, shadcn/ui, and Tailwind CSS.

![Install page](screenshots/docs-v2-install.png)

```bash
cd frontend && npm install && npm run dev
```

## Project Structure

```
├── src/              # MCP server (TypeScript)
├── frontend/         # Documentation site (React + shadcn/ui)
├── supabase/         # Edge Function + DB schema for auth
├── scripts/          # Admin utilities
├── docs/             # (moved to frontend/)
└── screenshots/      # App previews
```

## Build

```bash
npm install
npm run build
npm start -- --connectionString=postgresql://...
```

## License

MIT
