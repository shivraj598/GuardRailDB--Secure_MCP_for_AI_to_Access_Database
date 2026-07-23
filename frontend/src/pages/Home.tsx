import { Link } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const features = [
  {
    title: "Schema Compacting",
    desc: "Queries information_schema and compresses it into dense, LLM-readable Markdown — cutting token usage for database context.",
  },
  {
    title: "Strict Input Validation",
    desc: "Every tool call is parsed and validated against a Zod schema before becoming a safe, structured query. No SQL injection surface.",
  },
  {
    title: "Hard Pagination",
    desc: "Record requests are capped at 50 rows server-side, preventing runaway or malicious queries from flooding memory.",
  },
  {
    title: "Sandboxed Simulation",
    desc: "Mutating queries run inside a transaction that is immediately rolled back — zero risk to persistent data.",
  },
]

const tools = [
  { name: "get_schema", desc: "Compact Markdown schema of your database" },
  { name: "execute_query", desc: "Validated SELECT with READ ONLY + 50-row cap" },
  { name: "simulate_query", desc: "Sandboxed BEGIN / ROLLBACK for mutations" },
]

export default function Home() {
  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">
          GuardRail<span className="text-orange-500">DB</span>
        </h1>
        <p className="max-w-2xl text-zinc-400 text-base leading-relaxed">
          A secure, schema-aware MCP gateway connecting LLMs and AI agents to
          Postgres databases through a policy-controlled gateway.
        </p>
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <span className="inline-block h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
          Under production — deploying after security audit.
        </div>
        <div className="flex gap-3 pt-2">
          <Link
            to="/install"
            className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-500 transition-colors no-underline"
          >
            Get Started
          </Link>
          <a
            href="https://github.com/shivraj598/GuardRailDB--Secure_MCP_for_AI_to_Access_Database"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-zinc-300 hover:border-zinc-600 hover:text-white transition-colors no-underline"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            GitHub
          </a>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Core Features</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {features.map((f) => (
            <Card key={f.title} className="border-zinc-800 bg-zinc-900/50">
              <CardHeader>
                <CardTitle className="text-sm font-semibold text-white">{f.title}</CardTitle>
                <CardDescription className="text-xs text-zinc-400 leading-relaxed">{f.desc}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Exposed Tools</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {tools.map((t) => (
            <Card key={t.name} className="border-zinc-800 bg-zinc-900/50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-orange-500/10 text-orange-400 text-xs font-mono">
                    {t.name}
                  </Badge>
                </div>
                <CardDescription className="text-xs text-zinc-400 mt-2">{t.desc}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-bold text-white">Architecture</h2>
        <p className="text-sm text-zinc-400 leading-relaxed max-w-2xl">
          The server runs over MCP's stdio transport — spawned as a local child
          process by the calling client. Your connection string, schema, queries,
          and results never leave your machine. The only hosted infrastructure is
          a lightweight key-validation endpoint and this documentation site.
        </p>
      </div>
    </div>
  )
}
