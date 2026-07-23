import { Badge } from "@/components/ui/badge"

const entries = [
  {
    version: "v1.0.0",
    date: "July 23, 2026",
    tag: "Initial Release" as const,
    items: [
      "get_schema — Queries information_schema and compresses it into LLM-readable Markdown",
      "execute_query — Validated SELECT queries inside READ ONLY transaction with 50-row cap",
      "simulate_query — Sandboxed BEGIN/ROLLBACK for mutation previews with zero risk",
      "Zod-based input validation on every tool call closes off SQL injection from malformed LLM output",
      "Version-change notification — visible banner on startup when package is updated",
      "Zero-install via npx db-guardrail-mcp",
    ],
  },
  {
    version: "Upcoming",
    date: "Targeting Q3 2026",
    tag: "Planned" as const,
    items: [
      "API key gating — --apiKey will be required and validated server-side",
      "Paid tiers for production usage (free tier remains available)",
      "Usage dashboard for key holders",
    ],
  },
]

export default function Changelog() {
  const tagClass = (tag: string) => {
    switch (tag) {
      case "Initial Release": return "bg-green-500/10 text-green-400"
      case "Planned": return "bg-blue-500/10 text-blue-400"
      case "Breaking": return "bg-red-500/10 text-red-400"
      default: return "bg-zinc-500/10 text-zinc-400"
    }
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold text-white">Changelog</h1>
        <p className="text-zinc-400 mt-2">Release notes and announcements.</p>
      </div>

      {entries.map((entry) => (
        <div key={entry.version} className="border-b border-zinc-800 pb-6 last:border-0">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xl font-bold text-white">{entry.version}</span>
            <Badge variant="secondary" className={`text-xs font-medium ${tagClass(entry.tag)}`}>
              {entry.tag}
            </Badge>
          </div>
          <p className="text-xs text-zinc-600 mb-3">{entry.date}</p>
          <ul className="space-y-2">
            {entry.items.map((item, i) => (
              <li key={i} className="text-sm text-zinc-400 flex items-start gap-2">
                <span className="text-orange-500 mt-0.5">-</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
