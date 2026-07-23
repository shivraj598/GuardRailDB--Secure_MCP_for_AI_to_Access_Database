import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { resolve } from "node:path";

const CONFIG_DIR = resolve(homedir(), ".db-guardrail-mcp");
const LAST_VERSION_FILE = resolve(CONFIG_DIR, "last-version");

export function readPackageVersion(): string {
  try { return JSON.parse(readFileSync(resolve(import.meta.dirname, "../../package.json"), "utf-8")).version ?? "0.0.0"; }
  catch { return "0.0.0"; }
}

export function checkVersionChange(): void {
  const currentVersion = readPackageVersion();
  let lastVersion: string | null = null;

  try {
    if (existsSync(LAST_VERSION_FILE)) {
      lastVersion = readFileSync(LAST_VERSION_FILE, "utf-8").trim();
    }
  } catch { /* ignore read errors */ }

  if (lastVersion === currentVersion) return;

  const width = 60;
  const pad = (s: string) => `  ${s.padEnd(width - 4)}  `;
  const line = "─".repeat(width);

  const lines: string[] = [
    "",
    `┌${line}┐`,
    pad(`db-guardrail-mcp  v${currentVersion}`),
    `├${line}┤`,
  ];

  if (!lastVersion) {
    lines.push(pad("First run — welcome!"));
  } else {
    lines.push(pad(`Updated: v${lastVersion} → v${currentVersion}`));
  }

  lines.push(`├${line}┤`);
  lines.push(pad(""));
  lines.push(pad("This tool connects LLMs to your Postgres database"));
  lines.push(pad("over a secure, schema-aware MCP gateway."));
  lines.push(pad(""));

  if (currentVersion.startsWith("1.") && lastVersion && lastVersion.startsWith("1.")) {
    lines.push(pad("⚠  Free during Phase 1. A licensing change is"));
    lines.push(pad("   coming — see github.com/shivraj598/GuardRailDB"));
    lines.push(pad("   for details before the 2.0 release."));
  }

  lines.push(`└${line}┘`);
  lines.push("");

  console.error(lines.join("\n"));

  try {
    if (!existsSync(CONFIG_DIR)) mkdirSync(CONFIG_DIR, { recursive: true });
    writeFileSync(LAST_VERSION_FILE, currentVersion, "utf-8");
  } catch { /* ignore write errors */ }
}
