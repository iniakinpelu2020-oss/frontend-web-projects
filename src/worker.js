const PROJECT_ID = "apex-ai-1a873";
const JWKS_URL =
  "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com";

const ALLOWED_MODELS = [
    'openai/gpt-oss-20b:free',
    'openai/gpt-oss-120b:free',
    'google/gemma-4-31b-it:free',
    'qwen/qwen3-coder:free',
    'nvidia/nemotron-3.5-lightning:free',
    'nvidia/nemotron-3-ultra-550b-a55b:free',
    'nvidia/nemotron-3-super-120b-a12b:free',
    'poolside/laguna-s-2.1:free',
    'inclusionai/ling-3.1-flash',
    'stealth/space-bunny-alpha',
    'openrouter/free'
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

async function handleSummarize(req, env, cors) {
    const token = (req.headers.get("Authorization") || "").replace("Bearer ", "");
    if (!token || !(await verifyFirebaseToken(token))) {
        return new Response('{"error":"Sign in required."}', { status: 401, headers: cors });
    }
    const { messages } = await req.json();
    const upstream = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${env.OPENROUTER_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
            model: "openai/gpt-4o-mini",
            messages: [{ role: "system", content: "Summarize durable facts about this user in 2-3 bullet points (name, preferences, ongoing projects). If nothing durable, reply: none" }, ...messages],
            max_tokens: 150
        })
    });
    const data = await upstream.json();
    return new Response(JSON.stringify({ summary: data.choices?.[0]?.message?.content || "" }), { headers: { ...cors, "Content-Type": "application/json" } });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: CORS });
    }
    if (request.method !== "POST") {
      return new Response("apex-proxy running", { headers: CORS });
    }

    if (url.pathname === "/summarize") {
      return handleSummarize(request, env, CORS);
    }

    const token = (request.headers.get("Authorization") || "").replace("Bearer ", "");
    if (!token || !(await verifyFirebaseToken(token))) {
      return new Response("Unauthorized", { status: 403, headers: CORS });
    }

    let raw;
    try { raw = await request.text(); } catch (e) { return new Response("Bad request", { status: 400, headers: CORS }); }
    let payload;
    try { payload = JSON.parse(raw); } catch (e) { return new Response("Bad request", { status: 400, headers: CORS }); }

    if (!ALLOWED_MODELS.includes(payload.model) || !Array.isArray(payload.messages)) {
      return new Response("Model not allowed", { status: 400, headers: CORS });
    }
    if (JSON.stringify(payload.messages).length > 200000) {
      return new Response("Message too large", { status: 413, headers: CORS });
    }

    const useWebSearch = !!payload.web;
    const reqBody = {
        model: payload.model,
        messages: payload.messages,
        max_tokens: Math.min(Number(payload.max_tokens) || 3000, 3000),
    };
    if (useWebSearch) reqBody.plugins = [{ id: "web" }];

    let res;
    try {
      res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${env.OPENROUTER_API_KEY}`,
        },
        body: JSON.stringify(reqBody),
        signal: AbortSignal.timeout(45000),
      });
    } catch (err) {
      if (err.name === "TimeoutError" || err.name === "AbortError") {
        return new Response('{"error":"The AI took too long to respond. Please try again."}', { status: 504, headers: { ...CORS, "Content-Type": "application/json" } });
      }
      return new Response('{"error":"Could not reach the AI service. Please try again."}', { status: 502, headers: { ...CORS, "Content-Type": "application/json" } });
    }

    if (res.status === 429) {
      return new Response('{"error":"Too many requests right now. Please wait a moment and try again."}', { status: 429, headers: { ...CORS, "Content-Type": "application/json" } });
    }
    if (res.status === 402) {
      return new Response(res.body, { status: 402, headers: { ...CORS, "Content-Type": "application/json" } });
    }

    return new Response(res.body, {
      status: res.status,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  },
};
