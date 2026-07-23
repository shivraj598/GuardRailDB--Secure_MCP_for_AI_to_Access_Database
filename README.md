# GuardRailDB — Secure MCP for AI Database Access

A secure, schema-aware [Model Context Protocol (MCP)](https://modelcontextprotocol.io) gateway for Postgres databases. Lets LLMs and AI agents query your database without executing raw unconstrained SQL, blowing up context windows, or risking destructive changes.

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

## Build

```bash
npm install
npm run build
npm start -- --connectionString=postgresql://...
```

## License

MIT
