import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = Deno.env.get("NEXT_PUBLIC_SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function hashKey(apiKey: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(apiKey);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { apiKey } = await req.json();

    if (!apiKey || typeof apiKey !== "string") {
      return new Response(
        JSON.stringify({ valid: false, error: "Missing or invalid apiKey" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const keyHash = await hashKey(apiKey);

    const { data: keyRecord, error: lookupError } = await supabase
      .from("api_keys")
      .select("id, user_id, is_active, expires_at")
      .eq("key_hash", keyHash)
      .single();

    if (lookupError || !keyRecord) {
      return new Response(
        JSON.stringify({ valid: false, error: "Invalid API key" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!keyRecord.is_active) {
      return new Response(
        JSON.stringify({ valid: false, error: "API key is deactivated" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    if (keyRecord.expires_at && new Date(keyRecord.expires_at) < new Date()) {
      return new Response(
        JSON.stringify({ valid: false, error: "API key has expired" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    await supabase.from("usage_events").insert({
      api_key_id: keyRecord.id,
      user_id: keyRecord.user_id,
      event_type: "startup_ping",
      payload: { validated_at: new Date().toISOString() },
    });

    await supabase
      .from("api_keys")
      .update({ last_used_at: new Date().toISOString() })
      .eq("id", keyRecord.id);

    return new Response(
      JSON.stringify({ valid: true, user_id: keyRecord.user_id }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ valid: false, error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
