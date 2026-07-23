import { Link } from "react-router-dom"

export default function Install() {
  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold text-white">Install Guide</h1>
        <p className="text-zinc-400 mt-2">Get GuardRailDB running in under two minutes.</p>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-white">Prerequisites</h2>
        <ul className="list-disc list-inside space-y-1.5 text-sm text-zinc-400">
          <li><strong className="text-zinc-300">Node.js</strong> v18 or later</li>
          <li>A running <strong className="text-zinc-300">PostgreSQL</strong> instance (local or cloud, e.g. Supabase)</li>
          <li>Your database <strong className="text-zinc-300">connection string</strong> (<code className="text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded text-xs">postgresql://user:pass@host:5432/dbname</code>)</li>
        </ul>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-white">Quick Start</h2>
        <p className="text-sm text-zinc-400">Run with a single npx command:</p>
        <pre className="rounded-lg border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-300 overflow-x-auto">
          npx db-guardrail-mcp --connectionString=postgresql://user:pass@localhost:5432/mydb
        </pre>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Step by Step</h2>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-zinc-300">1. Get an API Key</h3>
          <p className="text-sm text-zinc-400">
            Sign up at <Link to="/signup" className="text-orange-400 hover:text-orange-300 underline underline-offset-2">guardraildb.dev/signup</Link> to receive your API key.
            In Phase 1 the key is accepted but not yet enforced.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-zinc-300">2. Run the Server</h3>
          <pre className="rounded-lg border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-300 overflow-x-auto">
{`npx db-guardrail-mcp \\
  --connectionString=postgresql://user:pass@localhost:5432/mydb \\
  --apiKey=your_key_here`}
          </pre>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-zinc-300">3. Confirm It's Running</h3>
          <p className="text-sm text-zinc-400">You should see a version banner and the server will wait for an MCP client to connect.</p>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-white">Troubleshooting</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left py-2 pr-4 text-zinc-500 font-medium">Problem</th>
                <th className="text-left py-2 text-zinc-500 font-medium">Solution</th>
              </tr>
            </thead>
            <tbody className="text-zinc-400">
              <tr className="border-b border-zinc-800">
                <td className="py-2 pr-4">Cannot connect to database</td>
                <td className="py-2">Verify your connection string — check host, port, credentials, and that your IP is allowed.</td>
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="py-2 pr-4">Invalid API key</td>
                <td className="py-2">Generate a new key from your account page. In Phase 1 you can omit --apiKey.</td>
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="py-2 pr-4">Node.js version error</td>
                <td className="py-2">Ensure you're on Node.js v18+. Run <code className="text-orange-400">node --version</code> to check.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
