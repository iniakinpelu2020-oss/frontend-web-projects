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

// ---------- Cleaning what index.html sends (so index.html needs no changes) ----------
const MAX_CHARS = 24000;      // total prompt budget (keeps Neuron use low)
const MAX_ONE_MESSAGE = 12000; // cap for any single message (e.g. a pasted file)

const MODE_NOTES = [
  ["Health consult mode:", "Health consult mode: provide general information only, encourage professional medical advice when appropriate."],
  ["Legal info mode:", "Legal info mode: provide general information only, avoid giving legal advice, and suggest consulting a qualified attorney when appropriate."],
  ["Finance mode:", "Finance mode: give general educational guidance, avoid personalized financial advice, and encourage checking official sources or a licensed professional."],
];

function textOf(content) {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((p) => (p && p.type === "text" ? p.text || "" : p && p.type === "image_url" ? "[image omitted]" : ""))
      .join("\n");
  }
  return "";
}

function cleanUserText(raw) {
  let t = raw;
  let mode = "";
  for (const [key, note] of MODE_NOTES) if (t.includes(key)) mode = note + " ";
  t = t.replace(/^\s*\[Respond in [^\]]+\]\s*/i, "");
  const marker = "User request:\n";
  const i = t.indexOf(marker);
  if (i !== -1) t = t.slice(i + marker.length);
  return (mode + t).trim();
}

function prepareMessages(raw) {
  const list = raw.filter((m) => m && typeof m.role === "string");
  const lastUser = [...list].reverse().find((m) => m.role === "user");
  const wantsPidgin = /\[Respond in Pidgin\]/i.test(textOf(lastUser?.content));

  let msgs = list.map((m) => {
    const text = textOf(m.content);
    return { role: m.role, content: m.role === "user" ? cleanUserText(text) : text };
  });

  msgs = msgs.map((m) =>
    m.content.length > MAX_ONE_MESSAGE
      ? { ...m, content: m.content.slice(0, MAX_ONE_MESSAGE) + "\n[...message shortened...]" }
      : m
  );

  const sys = msgs[0]?.role === "system" ? msgs[0] : null;
  const rest = sys ? msgs.slice(1) : msgs;
  let used = sys ? sys.content.length : 0;
  const kept = [];
  for (let i = rest.length - 1; i >= 0; i--) {
    if (kept.length > 0 && used + rest[i].content.length > MAX_CHARS) break;
    kept.unshift(rest[i]);
    used += rest[i].content.length;
  }
  return { messages: sys ? [sys, ...kept] : kept, wantsPidgin };
}

function addSystemNote(messages, note) {
  if (messages[0]?.role === "system") {
    return [{ ...messages[0], content: messages[0].content + "\n\n" + note }, ...messages.slice(1)];
  }
  return [{ role: "system", content: note }, ...messages];
}

const DIRECT_NOTE =
  "Answer the user's question directly. Do not ask whether they want a short answer, a detailed breakdown or a practical example, " +
  "and do not comment on their mood or feelings unless they bring it up.";

const PIDGIN_NOTE =
  "Reply in Nigerian Pidgin English as spoken in Nigeria and West Africa. Do NOT use Jamaican, Hawaiian or Caribbean spelling: " +
  "never write 'bruddah', 'da', 'dat', 'dis', 'tink' or 'gotchu'. Natural examples: 'How far? Wetin you wan know?', " +
  "'No wahala, I go help you.', 'Abeg, tell me more.', 'E no hard at all, na so e be.' " +
  "Useful words: abeg, wahala, wetin, dey, na, no be, sabi, oga, una, dem, pikin, sharp sharp, make we, e don do. " +
  "Keep the answers clear and correct.";

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

    const asked = Number(payload.max_tokens);
    const max_tokens = asked > 0 ? Math.min(asked, MAX_TOKENS_CAP) : DEFAULT_MAX_TOKENS;

    // Live web search (only when the page asks for it and a Tavily key is set).
    const prepared = prepareMessages(payload.messages);
    let messages = prepared.messages;
    messages = addSystemNote(messages, DIRECT_NOTE);
    if (prepared.wantsPidgin) messages = addSystemNote(messages, PIDGIN_NOTE);
    if (payload.web === true && env.TAVILY_API_KEY) {
      try {
        const lastUser = [...messages].reverse().find((m) => m.role === "user");
        let query = "";
        if (typeof lastUser?.content === "string") query = lastUser.content;
        else if (Array.isArray(lastUser?.content))
          query = lastUser.content.filter((p) => p.type === "text").map((p) => p.text).join(" ");
        query = query.trim();
        if (query.length < 50) {
          const users = messages.filter((m) => m.role === "user");
          const prev = users.length > 1 ? users[users.length - 2].content : "";
          if (prev) query = (prev.slice(0, 150) + " " + query).trim();
        }
        query = query.slice(0, 380);
        if (query) {
          const ctrl = new AbortController();
          const timer = setTimeout(() => ctrl.abort(), 6000);
          const sr = await fetch("https://api.tavily.com/search", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${env.TAVILY_API_KEY}`,
            },
            body: JSON.stringify({ query, search_depth: "basic", max_results: 3 }),
            signal: ctrl.signal,
          });
          clearTimeout(timer);
          if (sr.ok) {
            const sd = await sr.json();
            const found = (sd.results || [])
              .slice(0, 3)
              .map((r, i) => `[${i + 1}] ${r.title}\n${String(r.content || "").slice(0, 500)}\nSource: ${r.url}`)
              .join("\n\n");
            if (found) {
              const note =
                `Current web search results (today is ${new Date().toISOString().slice(0, 10)}). ` +
                `Use them for up-to-date facts and mention the source when relevant:\n\n${found}`;
              if (messages[0]?.role === "system" && typeof messages[0].content === "string") {
                messages = [{ ...messages[0], content: messages[0].content + "\n\n" + note }, ...messages.slice(1)];
              } else {
                messages = [{ role: "system", content: note }, ...messages];
              }
            }
          }
        }
      } catch (e) {
        // If search fails, just answer without it.
      }
    }

    const json = (obj, status = 200) =>
      new Response(JSON.stringify(obj), {
        status,
        headers: { ...CORS, "Content-Type": "application/json", "Cache-Control": "no-store" },
      });

    try {
      const result = await env.AI.run(AI_MODEL, {
        messages,
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
