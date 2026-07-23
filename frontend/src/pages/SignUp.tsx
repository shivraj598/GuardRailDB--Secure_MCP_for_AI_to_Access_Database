import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default function SignUp() {
  const [submitted, setSubmitted] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || password.length < 8) return
    setSubmitted(true)
  }

  return (
    <div className="space-y-8 max-w-md">
      <div>
        <h1 className="text-3xl font-bold text-white">Get Your API Key</h1>
        <p className="text-zinc-400 mt-2">Sign up to receive an API key for GuardRailDB.</p>
      </div>

      {!submitted ? (
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader>
            <CardTitle className="text-white text-base">Create Account</CardTitle>
            <CardDescription className="text-zinc-400 text-sm">
              Enter your details to generate an API key.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm text-zinc-400 font-medium">Email address</label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-zinc-700 bg-zinc-950 text-white placeholder:text-zinc-600"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm text-zinc-400 font-medium">Password</label>
                <Input
                  id="password"
                  type="password"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  required
                  className="border-zinc-700 bg-zinc-950 text-white placeholder:text-zinc-600"
                />
              </div>
              <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-500 text-white">
                Create Account & Get Key
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader>
            <CardTitle className="text-white text-base">Your API Key</CardTitle>
            <CardDescription className="text-zinc-400 text-sm">
              Use this key with the <code className="text-orange-400 text-xs">--apiKey</code> flag. Store it securely.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="rounded-lg border border-zinc-700 bg-zinc-950 p-4 text-sm text-zinc-300 overflow-x-auto flex items-center justify-between">
              <span>gb_{Array.from({length:4},()=>Math.random().toString(36).slice(2,6)).join('_')}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigator.clipboard.writeText(`gb_${Array.from({length:4},()=>Math.random().toString(36).slice(2,6)).join('_')}`)}
                className="border-zinc-700 text-zinc-400 hover:text-white"
              >
                Copy
              </Button>
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
