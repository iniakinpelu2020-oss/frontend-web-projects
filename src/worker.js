const PROJECT_ID = "apex-ai-1a873";
const JWKS_URL =
  "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com";

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

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${env.OPENROUTER_API_KEY}`,
      },
      body: request.body,
    });
    return new Response(res.body, {
      status: res.status,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  },
};