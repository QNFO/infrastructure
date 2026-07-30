// qnfo-qwav v2.0 — CORS FIXED (2026-07-30)
// corsHeaders() now returns "https://qwav.org" instead of wildcard "*"
// Routes: /health, /ask (Vectorize + LIKE fallback), /ai/ask, /ai/search

var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var MAX_QUERY_CHARS = 500;
var SYSTEM_PROMPT = "You are the QNFO Research Assistant. Answer questions using ONLY the provided QNFO/QWAV research corpus context. Cite paper titles when you draw on them. If the corpus does not contain an answer, say so plainly. Keep answers concise, precise, and faithful to the source papers.";

var worker_default = {
  async fetch(request, env) {
    const u = new URL(request.url), p = u.pathname;
    const h = corsHeaders();
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: h });
    if (p === "/health") return json({ status: "ok", worker: "qnfo-qwav", version: "2.0-cors-fixed", bindings: { d1: "living-paper", r2: "qnfo", vz: "qwav-research-v2", ai: !!env.AI, ai_search: !!env.QNFO_SEARCH }, routes: ["/health","/ask","/ai/ask","/ai/search"] }, 200, h);
    if (p === "/ask" && request.method === "POST") return handleAsk(request, env, h);
    if (p === "/ai/ask" && request.method === "POST") return handleAiAsk(request, env, h);
    if (p === "/ai/search" && request.method === "POST") return handleAiSearch(request, env, h);
    return json({ error: "Not found" }, 404, h);
  }
};

// FIXED: CORS wildcard replaced with domain-locked origin
function corsHeaders() {
  return { "Content-Type": "application/json", "Access-Control-Allow-Origin": "https://qwav.org", "Access-Control-Allow-Methods": "GET,POST,OPTIONS", "Access-Control-Allow-Headers": "Content-Type" };
}

function json(obj, status, h) { status = status || 200; return new Response(JSON.stringify(obj), { status, headers: h || corsHeaders() }); }

async function readQuery(request) { const body = await request.json().catch(function() { return {}; }); const query = (body.query || "").toString().trim(); if (!query) return { error: "Missing query" }; if (query.length > MAX_QUERY_CHARS) return { error: "Query too long (max " + MAX_QUERY_CHARS + " chars)" }; return { query, body }; }

async function handleAsk(request, env, h) {
  try {
    var _a = await readQuery(request), query = _a.query, _b = _a.error, error = _b === void 0 ? null : _b, body = _a.body;
    if (error) return json({ error }, 400, h);
    var topK = Math.min(parseInt(body.limit) || 5, 25);
    if (env.AI && env.QWAV_VZ) {
      try {
        var embedResult = await env.AI.run("@cf/baai/bge-base-en-v1.5", { text: [query] });
        var vector = (embedResult == null ? void 0 : embedResult.data) == null ? void 0 : embedResult.data[0];
        if (vector) {
          var matches = await env.QWAV_VZ.query(vector, { topK, returnMetadata: "all" });
          if (matches.matches && matches.matches.length > 0) {
            var results = matches.matches.map(function(m) { return { id: m.id, score: m.score, title: (m.metadata == null ? void 0 : m.metadata.title) || null, abstract: (m.metadata == null ? void 0 : m.metadata.abstract) || (m.metadata == null ? void 0 : m.metadata.text) || null, slug: (m.metadata == null ? void 0 : m.metadata.slug) || null }; });
            return json({ query, mode: "vector", count: results.length, results }, 200, h);
          }
        }
      } catch (e) {}
    }
    var ref = await env.LIVING_PAPER.prepare("SELECT title,abstract FROM papers WHERE title LIKE ? OR abstract LIKE ? LIMIT ?").bind("%" + query + "%", "%" + query + "%", topK).all();
    return json({ query, mode: "like_fallback", results: ref.results, count: ref.results.length }, 200, h);
  } catch (e) { return json({ error: e.message }, 500, h); }
}

async function handleAiAsk(request, env, h) {
  var _a = await readQuery(request), query = _a.query, _b = _a.error, error = _b === void 0 ? null : _b;
  if (error) return json({ error }, 400, h);
  if (!env.QNFO_SEARCH) return json({ error: "AI Search unavailable" }, 503, h);
  try {
    var res = await env.QNFO_SEARCH.chatCompletions({ messages: [{ role: "system", content: SYSTEM_PROMPT }, { role: "user", content: query }] });
    var answer = (res == null ? void 0 : res.choices) == null ? void 0 : res.choices[0].message.content;
    return json({ query, mode: "ai_search_chat", answer: answer || null, sources: extractSources((res == null ? void 0 : res.chunks) || (res == null ? void 0 : res.result) == null ? void 0 : res.result.chunks || []), model: (res == null ? void 0 : res.model) || null }, 200, h);
  } catch (e) {
    try { return await aiSearchRetrieve(query, env, h, "ai_search_fallback"); }
    catch (e2) { return json({ error: "AI answer failed: " + e.message }, 502, h); }
  }
}

async function handleAiSearch(request, env, h) {
  var _a = await readQuery(request), query = _a.query, _b = _a.error, error = _b === void 0 ? null : _b;
  if (error) return json({ error }, 400, h);
  if (!env.QNFO_SEARCH) return json({ error: "AI Search unavailable" }, 503, h);
  try { return await aiSearchRetrieve(query, env, h, "ai_search"); }
  catch (e) { return json({ error: "Search failed: " + e.message }, 502, h); }
}

async function aiSearchRetrieve(query, env, h, mode) {
  var res = await env.QNFO_SEARCH.search({ messages: [{ role: "user", content: query }] });
  var chunks = (res == null ? void 0 : res.chunks) || (res == null ? void 0 : res.result) == null ? void 0 : res.result.chunks || [];
  var results = chunks.map(function(c) { return { file: (c.item == null ? void 0 : c.item.key) || null, slug: slugOf(c.item == null ? void 0 : c.item.key), score: c.score ?? null, content: (c.text || "").slice(0, 600) }; });
  return json({ query, mode, count: results.length, results }, 200, h);
}

function slugOf(key) { return key ? key.replace(/\.md$/, "") : null; }
function extractSources(chunks) { var seen = new Set(); var sources = []; for (var i = 0; i < chunks.length; i++) { var c = chunks[i]; var key = (c.item == null ? void 0 : c.item.key) || null; if (key && !seen.has(key)) { seen.add(key); sources.push({ file: key, slug: slugOf(key), score: c.score ?? null }); } } return sources; }

export { worker_default as default };
