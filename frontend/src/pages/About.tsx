export default function About() {
  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold text-white">About the Project</h1>
        <p className="text-zinc-400 mt-2">A portfolio project demonstrating protocol-level AI integration and security-first systems design.</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Skills This Demonstrates</h2>
        <ul className="space-y-3">
          {[
            ["Protocol-level AI integration", "Built directly on Anthropic's MCP SDK, handling the JSON-RPC 2.0 handshake and lifecycle rather than wrapping a chat API."],
            ["Security-first systems design", "Input validation, query sandboxing, and hard resource limits applied before trusting anything an LLM outputs."],
            ["Token/context efficiency as a design constraint", "Treating prompt real estate as a scarce resource the same way you'd treat memory or bandwidth."],
            ["Production-minded TypeScript", "Typed interfaces, runtime validation (Zod), and a real build/distribution pipeline (esbuild via tsup, SemVer, public NPM release)."],
            ["Distributed, zero-trust architecture", "A tool that runs entirely on the end user's machine so there's no central point where their data or credentials pass through."],
          ].map(([title, desc]) => (
            <li key={title} className="text-sm">
              <strong className="text-zinc-300">{title}</strong>
              <p className="text-zinc-400 mt-1">{desc}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Tech Stack</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left py-2 pr-4 text-zinc-500 font-medium">Layer</th>
                <th className="text-left py-2 text-zinc-500 font-medium">Tools</th>
              </tr>
            </thead>
            <tbody className="text-zinc-400">
              {[
                ["AI / Protocol", "@modelcontextprotocol/sdk, JSON-RPC 2.0, Stdio transport"],
                ["Runtime", "Node.js 24 LTS, TypeScript 5+"],
                ["Data", "pg (node-postgres), Zod for input validation"],
                ["Build / Distribution", "tsup (esbuild), NPM, SemVer"],
                ["Auth Backend", "Supabase (Auth, Edge Functions, Postgres)"],
              ].map(([layer, tools]) => (
                <tr key={layer} className="border-b border-zinc-800">
                  <td className="py-2 pr-4 text-zinc-300 font-medium">{layer}</td>
                  <td className="py-2">{tools}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-white">Architecture</h2>
        <p className="text-sm text-zinc-400 leading-relaxed">
          The server is designed around a zero-trust principle: there is no hosted infrastructure sitting between the user's AI client and their database. The package executes entirely on the user's machine and talks to their database over stdio.
        </p>
        <p className="text-sm text-zinc-400 leading-relaxed">
          The only centralized services are the NPM registry for package distribution, Supabase for user accounts and usage logging, and this documentation site.
        </p>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-white">About the Developer</h2>
        <p className="text-sm text-zinc-400 leading-relaxed">
          Built by <a href="https://github.com/shivraj598" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300 underline underline-offset-2">Shivraj Timilsena</a>. This project is positioned as a portfolio piece for an AI engineering role. The full source is available on <a href="https://github.com/shivraj598/GuardRailDB--Secure_MCP_for_AI_to_Access_Database" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300 underline underline-offset-2">GitHub</a>.
        </p>
      </div>
    </div>
  )
}
