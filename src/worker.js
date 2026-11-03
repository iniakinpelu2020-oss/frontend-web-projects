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
  const i = t.lastIndexOf(marker); // last one = the real question (older turns can be nested inside the hidden text)
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
  "and do not comment on their mood or feelings unless they bring it up. " +
  "You cannot browse the internet yourself: never say you are checking the internet or going to check. " +
  "Only treat web results as real if they appear in this conversation. " +
  "If you are not sure about a recent fact, say you are not sure instead of guessing.";

const PIDGIN_NOTE =
  "Reply in Nigerian Pidgin English as spoken in Nigeria and West Africa. Do NOT use Jamaican, Hawaiian or Caribbean spelling: " +
  "never write 'bruddah', 'da', 'dat', 'dis', 'tink' or 'gotchu'. " +
  "Use 'I' (not 'me') as the subject: 'I no dey mad', 'I go help you'. " +
  "Do not end every sentence with 'abi?' and do not repeat sentences. " +
  "Natural examples: 'How far? Wetin you wan know?', 'No wahala, I go help you.', 'Abeg, tell me more.', " +
  "'E no hard at all, na so e be.', 'I no sure about dat one, make I no lie you.' " +
  "Useful words: abeg, wahala, wetin, dey, na, no be, sabi, oga, una, dem, pikin, sharp sharp, make we, e don do. " +
  "Keep the answers clear and correct.";

const SEARCH_RE = /\b(news|today|tonight|yesterday|latest|current|currently|recent|recently|right now|this (week|month|year)|last (night|week|month|year)|who is|who won|winner|election|president|governor|minister|score|results?|fixtures?|price of|exchange rate|stock|weather|happening|dey happen|internet|google|20(2[4-9]|3\d))\b/i;

const SMALL_TALK_RE = /^(hi+|hello+|hey+|how far|good (morning|afternoon|evening|night)|thanks?( you)?|thank u|ok(ay)?( oo?)?|yes|no|lol|wow|nice|cool|bye)[\s!.?]*$/i;

const SKIP_RE = /\b(write|code|script|function|translate|poem|story|essay|rewrite|summari[sz]e|debug|fix|html|css|python|javascript|regex|sql)\b/i;

const FACT_Q_RE = /^\s*(who|what|when|where|which|how (many|much|old|long|tall)|wetin|na who|who be|is|are|did|does|do you know)\b/i;

const NO_SEARCH_NOTE =
  "Live web search is NOT available for this message. Do not claim to have checked the internet. " +
  "If the question is about recent events or current office holders, say clearly that you could not check live information and may be out of date.";

async function liveSearch(env, messages) {
  if (!env.TAVILY_API_KEY) return { status: "no key set", note: "" };
  try {
    const users = messages.filter((m) => m.role === "user");
    let query = (users[users.length - 1]?.content || "").trim();
    if (query.length < 50 && users.length > 1) {
      query = (users[users.length - 2].content.slice(0, 150) + " " + query).trim();
    }
    query = query.slice(0, 380);
    if (!query) return { status: "empty query", note: "" };

    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 6000);
    const sr = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${env.TAVILY_API_KEY}` },
      body: JSON.stringify({ query, search_depth: "basic", max_results: 3 }),
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    if (!sr.ok) return { status: "error " + sr.status, note: "" };
    const sd = await sr.json();
    const found = (sd.results || [])
      .slice(0, 3)
      .map((r, i) => `[${i + 1}] ${r.title}\n${String(r.content || "").slice(0, 500)}\nSource: ${r.url}`)
      .join("\n\n");
    if (!found) return { status: "no results", note: "" };
    return {
      status: "ok",
      note:
        `Current web search results (today is ${new Date().toISOString().slice(0, 10)}). ` +
        `These are up to date. If they conflict with what you remember, trust the results, and mention the source.\n\n${found}`,
    };
  } catch (e) {
    return { status: "failed", note: "" };
  }
}

const handler = {
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

    // Live web search: when the page asks for it OR the message looks like it needs current info.
    const lastText = [...messages].reverse().find((m) => m.role === "user")?.content || "";
    // Smart search: only when the message looks like it needs facts. Saves your free Tavily credits.
    const t = lastText.trim();
    const wantsSearch =
      payload.web === true ||
      (t.length >= 8 && t.length <= 600 && !SMALL_TALK_RE.test(t) && !SKIP_RE.test(t) &&
        (SEARCH_RE.test(t) || FACT_Q_RE.test(t)));
    let searchStatus = "skipped";
    if (wantsSearch) {
      const found = await liveSearch(env, messages);
      searchStatus = found.status;
      messages = addSystemNote(messages, found.note || NO_SEARCH_NOTE);
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
      const flag = wantsSearch && searchStatus !== "ok"
        ? `\n\n(Live web search unavailable: ${searchStatus}. This answer may be out of date.)`
        : "";
      return json({ choices: [{ message: { role: "assistant", content: content + flag } }] });
    } catch (e) {
      const msg = String((e && e.message) || e);
      const limited = /neuron|allocation|quota|rate|limit|429/i.test(msg);
      return json({ error: { message: msg.slice(0, 200) } }, limited ? 429 : 502);
    }
  },
};

// Safety net: if anything crashes, still answer with CORS headers so the page shows a real error
// instead of "Request failed ()".
export default {
  async fetch(request, env, ctx) {
    try {
      return await handler.fetch(request, env, ctx);
    } catch (e) {
      const msg = String((e && e.message) || e).slice(0, 150);
      console.log("Worker crashed:", msg);
      return new Response(JSON.stringify({ error: { message: "Worker error: " + msg } }), {
        status: 500,
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    }
  },
};
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
  const i = t.lastIndexOf(marker); // last one = the real question (older turns can be nested inside the hidden text)
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
  "and do not comment on their mood or feelings unless they bring it up. " +
  "You cannot browse the internet yourself: never say you are checking the internet or going to check. " +
  "Only treat web results as real if they appear in this conversation. " +
  "If you are not sure about a recent fact, say you are not sure instead of guessing.";

const PIDGIN_NOTE =
  "Reply in Nigerian Pidgin English as spoken in Nigeria and West Africa. Do NOT use Jamaican, Hawaiian or Caribbean spelling: " +
  "never write 'bruddah', 'da', 'dat', 'dis', 'tink' or 'gotchu'. " +
  "Use 'I' (not 'me') as the subject: 'I no dey mad', 'I go help you'. " +
  "Do not end every sentence with 'abi?' and do not repeat sentences. " +
  "Natural examples: 'How far? Wetin you wan know?', 'No wahala, I go help you.', 'Abeg, tell me more.', " +
  "'E no hard at all, na so e be.', 'I no sure about dat one, make I no lie you.' " +
  "Useful words: abeg, wahala, wetin, dey, na, no be, sabi, oga, una, dem, pikin, sharp sharp, make we, e don do. " +
  "Keep the answers clear and correct.";

const SEARCH_RE = /\b(news|today|tonight|yesterday|latest|current|currently|recent|recently|right now|this (week|month|year)|last (night|week|month|year)|who is|who won|winner|election|president|governor|minister|score|results?|fixtures?|price of|exchange rate|stock|weather|happening|dey happen|internet|google|20(2[4-9]|3\d))\b/i;

const SMALL_TALK_RE = /^(hi+|hello+|hey+|how far|good (morning|afternoon|evening|night)|thanks?( you)?|thank u|ok(ay)?( oo?)?|yes|no|lol|wow|nice|cool|bye)[\s!.?]*$/i;

const SKIP_RE = /\b(write|code|script|function|translate|poem|story|essay|rewrite|summari[sz]e|debug|fix|html|css|python|javascript|regex|sql)\b/i;

const FACT_Q_RE = /^\s*(who|what|when|where|which|how (many|much|old|long|tall)|wetin|na who|who be|is|are|did|does|do you know)\b/i;

const NO_SEARCH_NOTE =
  "Live web search is NOT available for this message. Do not claim to have checked the internet. " +
  "If the question is about recent events or current office holders, say clearly that you could not check live information and may be out of date.";

async function liveSearch(env, messages) {
  if (!env.TAVILY_API_KEY) return { status: "no key set", note: "" };
  try {
    const users = messages.filter((m) => m.role === "user");
    let query = (users[users.length - 1]?.content || "").trim();
    if (query.length < 50 && users.length > 1) {
      query = (users[users.length - 2].content.slice(0, 150) + " " + query).trim();
    }
    query = query.slice(0, 380);
    if (!query) return { status: "empty query", note: "" };

    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 6000);
    const sr = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${env.TAVILY_API_KEY}` },
      body: JSON.stringify({ query, search_depth: "basic", max_results: 3 }),
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    if (!sr.ok) return { status: "error " + sr.status, note: "" };
    const sd = await sr.json();
    const found = (sd.results || [])
      .slice(0, 3)
      .map((r, i) => `[${i + 1}] ${r.title}\n${String(r.content || "").slice(0, 500)}\nSource: ${r.url}`)
      .join("\n\n");
    if (!found) return { status: "no results", note: "" };
    return {
      status: "ok",
      note:
        `Current web search results (today is ${new Date().toISOString().slice(0, 10)}). ` +
        `These are up to date. If they conflict with what you remember, trust the results, and mention the source.\n\n${found}`,
    };
  } catch (e) {
    return { status: "failed", note: "" };
  }
}

const handler = {
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

    // Live web search: when the page asks for it OR the message looks like it needs current info.
    const lastText = [...messages].reverse().find((m) => m.role === "user")?.content || "";
    // Smart search: only when the message looks like it needs facts. Saves your free Tavily credits.
    const t = lastText.trim();
    const wantsSearch =
      payload.web === true ||
      (t.length >= 8 && t.length <= 600 && !SMALL_TALK_RE.test(t) && !SKIP_RE.test(t) &&
        (SEARCH_RE.test(t) || FACT_Q_RE.test(t)));
    let searchStatus = "skipped";
    if (wantsSearch) {
      const found = await liveSearch(env, messages);
      searchStatus = found.status;
      messages = addSystemNote(messages, found.note || NO_SEARCH_NOTE);
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
      const flag = wantsSearch && searchStatus !== "ok"
        ? `\n\n(Live web search unavailable: ${searchStatus}. This answer may be out of date.)`
        : "";
      return json({ choices: [{ message: { role: "assistant", content: content + flag } }] });
    } catch (e) {
      const msg = String((e && e.message) || e);
      const limited = /neuron|allocation|quota|rate|limit|429/i.test(msg);
      return json({ error: { message: msg.slice(0, 200) } }, limited ? 429 : 502);
    }
  },
};

// Safety net: if anything crashes, still answer with CORS headers so the page shows a real error
// instead of "Request failed ()".
export default {
  async fetch(request, env, ctx) {
    try {
      return await handler.fetch(request, env, ctx);
    } catch (e) {
      const msg = String((e && e.message) || e).slice(0, 150);
      console.log("Worker crashed:", msg);
      return new Response(JSON.stringify({ error: { message: "Worker error: " + msg } }), {
        status: 500,
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    }
  },
};
    
