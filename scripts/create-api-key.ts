import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function hashKey(apiKey: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(apiKey);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error("Usage: npx tsx scripts/create-api-key.ts <user-email>");
    process.exit(1);
  }

  const { data: users, error: userError } = await supabase.auth.admin.listUsers();
  if (userError) {
    console.error("Failed to list users:", userError.message);
    process.exit(1);
  }

  const user = users.users.find((u: any) => u.email === email);
  if (!user) {
    console.error(`User not found: ${email}`);
    console.error("Make sure the user has signed up first.");
    process.exit(1);
  }

  const rawKey = `gb_${crypto.randomUUID().replace(/-/g, "").slice(0, 24)}`;
  const keyHash = await hashKey(rawKey);

  const { error: insertError } = await supabase.from("api_keys").insert({
    user_id: user.id,
    key_hash: keyHash,
    label: "default",
  });

  if (insertError) {
    console.error("Failed to create API key:", insertError.message);
    process.exit(1);
  }

  console.log(`API key created for ${email}:`);
  console.log(rawKey);
}

main().catch(console.error);
