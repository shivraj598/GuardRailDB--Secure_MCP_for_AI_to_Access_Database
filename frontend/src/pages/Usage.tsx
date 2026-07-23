import { Badge } from "@/components/ui/badge"

export default function Usage() {
  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold text-white">Usage Guide</h1>
        <p className="text-zinc-400 mt-2">How to connect MCP clients and use the exposed tools.</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Exposed Tools</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { name: "get_schema", desc: "Compact Markdown summary of the database schema — tables, columns, types, and primary keys." },
            { name: "execute_query", desc: "Validated SELECT query inside a READ ONLY transaction with hard 50-row pagination." },
            { name: "simulate_query", desc: "Any SQL inside a sandboxed transaction that rolls back — zero risk to persistent data." },
          ].map((t) => (
            <div key={t.name} className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
              <Badge variant="secondary" className="bg-orange-500/10 text-orange-400 text-xs font-mono mb-2">{t.name}</Badge>
              <p className="text-xs text-zinc-400">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Connecting MCP Clients</h2>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-zinc-300">Claude Desktop</h3>
          <p className="text-sm text-zinc-400">Add to <code className="text-orange-400 text-xs">claude_desktop_config.json</code>:</p>
          <pre className="rounded-lg border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-300 overflow-x-auto">
{`{
  "mcpServers": {
    "db-guardrail": {
      "command": "npx",
      "args": [
        "db-guardrail-mcp",
        "--connectionString", "postgresql://...",
        "--apiKey", "your_key_here"
      ]
    }
  }
}`}
          </pre>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-zinc-300">Custom CLI / Script</h3>
          <pre className="rounded-lg border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-300 overflow-x-auto">
{`import { spawn } from 'node:child_process'

const server = spawn('npx', [
  'db-guardrail-mcp',
  '--connectionString', 'postgresql://...',
  '--apiKey', 'your_key_here',
])
// Communicate over stdin/stdout using JSON-RPC 2.0`}
          </pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Important Behavior</h2>

        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-semibold text-zinc-300">Pagination is Hard-Capped at 50 Rows</h3>
            <p className="text-sm text-zinc-400">Regardless of what the model requests, execute_query will never return more than 50 rows. This protects against runaway queries and context-window overflow.</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-300">Data Never Leaves Your Machine</h3>
            <p className="text-sm text-zinc-400">Your connection string, schema, queries, and results stay entirely on your machine. The only outbound call is a lightweight ping to validate your API key.</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-300">Mutations Require Simulation</h3>
            <p className="text-sm text-zinc-400">execute_query runs inside a BEGIN READ ONLY transaction — writes are rejected. To preview mutations, use simulate_query which issues a ROLLBACK after execution.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
