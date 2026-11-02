const PROJECT_ID = "apex-ai-1a873";
const JWKS_URL =
  "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com";

const AI_MODEL = "@cf/meta/llama-3.1-8b-instruct-fp8-fast";
const DEFAULT_MAX_TOKENS = 800;
const MAX_TOKENS_CAP = 2048;

// index.html still sends these names; they are only checked, then replaced by AI_MODEL.
const ALLOWED_MODELS = [
  "google/gemma-4-31b-it:free",
  "openrouter/free",
];

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
};

const b64 = (s) =>
  Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0));

async function verifyFirebaseToken(token) {
  try {
    const [h, p, s] = token.split(".");
    const dec = new TextDecoder();
    const header = JSON.parse(dec.decode(b64(h)));
    const payload = JSON.parse(dec.decode(b64(p)));
    const now = Math.floor(Date.now() / 1000);
    if (
      header.alg !== "RS256" ||
      payload.aud !== PROJECT_ID ||
      payload.iss !== `https://securetoken.google.com/${PROJECT_ID}` ||
      payload.exp < now ||
      !payload.sub
    ) return false;

    const { keys } = await (
      await fetch(JWKS_URL, { cf: { cacheTtl: 3600, cacheEverything: true } })
    ).json();
    const jwk = keys.find((k) => k.kid === header.kid);
    if (!jwk) return false;

    const key = await crypto.subtle.importKey(
      "jwk", jwk, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]
    );
    return await crypto.subtle.verify(
      "RSASSA-PKCS1-v1_5", key, b64(s), new TextEncoder().encode(`${h}.${p}`)
    );
  } catch (e) {
    return false;
  }
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: CORS });
    }
    if (request.method !== "POST") {
      return new Response("apex-proxy running", { headers: CORS });
    }

    const token = (request.headers.get("Authorization") || "").replace("Bearer ", "");
    if (!token || !(await verifyFirebaseToken(token))) {
      return new Response("Unauthorized", { status: 403, headers: CORS });
    }

    let payload;
    try { payload = await request.json(); }
    catch (e) { return new Response("Bad request", { status: 400, headers: CORS }); }

    if (!ALLOWED_MODELS.includes(payload.model) || !Array.isArray(payload.messages)) {
      return new Response("Model not allowed", { status: 400, headers: CORS });
    }
    if (JSON.stringify(payload.messages).length > 200000) {
      return new Response("Message too large", { status: 413, headers: CORS });
    }

    const asked = Number(payload.max_tokens);
    const max_tokens = asked > 0 ? Math.min(asked, MAX_TOKENS_CAP) : DEFAULT_MAX_TOKENS;

    const json = (obj, status = 200) =>
      new Response(JSON.stringify(obj), {
        status,
        headers: { ...CORS, "Content-Type": "application/json", "Cache-Control": "no-store" },
      });

    try {
      const result = await env.AI.run(AI_MODEL, {
        messages: payload.messages,
        max_tokens,
      });
      const content =
        result?.response ?? result?.choices?.[0]?.message?.content ?? "";
      // Same shape OpenRouter returned, so index.html needs no changes.
      return json({ choices: [{ message: { role: "assistant", content } }] });
    } catch (e) {
      const msg = String((e && e.message) || e);
      const limited = /neuron|allocation|quota|rate|limit|429/i.test(msg);
      return json({ error: { message: msg.slice(0, 200) } }, limited ? 429 : 502);
    }
  },
};
