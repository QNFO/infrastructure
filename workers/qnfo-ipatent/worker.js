// qnfo-ipatent — v1.2 (CORS fixed, stack leak removed)
// Deployed 2026-07-30 via red team audit fix

var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

var worker_default = {
  async fetch(request, env) {
    const u = new URL(request.url), p = u.pathname;
    const origin = request.headers.get("Origin") || "https://ipatent.me";
    const h = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: h });
    if (p === "/health") return new Response(JSON.stringify({
      status: "ok",
      worker: "qnfo-ipatent",
      version: "1.2",
      bindings: { d1: "ipatent-db", r2: "ipatent", vz: "ipatent-disclosures", ai: true }
    }), { headers: h });
    if (p === "/api/disclosures" && request.method === "GET") return handleDisclosures(request, env, origin);
    if (p === "/api/search") return handleSearch(request, env, origin);
    return new Response(JSON.stringify({ error: "Not found", path: p }), { status: 404, headers: h });
  }
};

function corsHeaders(origin) {
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": origin || "https://ipatent.me"
  };
}

async function handleDisclosures(request, env, origin) {
  const ch = corsHeaders(origin);
  try {
    const { results } = await env.IPATENT_DB.prepare(
      "SELECT submission_id, title, abstract, status, created_at FROM submissions ORDER BY created_at DESC LIMIT 50"
    ).all();
    return new Response(JSON.stringify({ disclosures: results, count: results.length }), { headers: ch });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: ch });
  }
}

async function handleSearch(request, env, origin) {
  const ch = corsHeaders(origin);
  try {
    let query = "";
    let limit = 10;
    if (request.method === "POST") {
      const body = await request.json().catch(() => ({}));
      query = (body.query || body.q || "").toString().trim();
      if (body.limit) limit = Math.min(parseInt(body.limit) || 10, 50);
    } else {
      const u = new URL(request.url);
      query = (u.searchParams.get("query") || u.searchParams.get("q") || "").trim();
      if (u.searchParams.get("limit")) limit = Math.min(parseInt(u.searchParams.get("limit")) || 10, 50);
    }
    if (!query) {
      return new Response(JSON.stringify({ error: "Missing query parameter (query/q)" }), { status: 400, headers: ch });
    }
    if (!env.AI) {
      return new Response(JSON.stringify({ error: "AI binding not configured" }), { status: 503, headers: ch });
    }
    if (!env.DISCLOSURES_VZ) {
      return new Response(JSON.stringify({ error: "Vectorize binding not configured" }), { status: 503, headers: ch });
    }
    const embedResult = await env.AI.run("@cf/baai/bge-large-en-v1.5", { text: [query] });
    const vector = embedResult?.data?.[0];
    if (!vector) {
      return new Response(JSON.stringify({ error: "Failed to generate query embedding" }), { status: 500, headers: ch });
    }
    const matches = await env.DISCLOSURES_VZ.query(vector, { topK: limit, returnMetadata: "all" });
    const submissionIds = (matches.matches || []).map(m => m.metadata?.submission_id || m.id).filter(Boolean);
    let enriched = matches.matches || [];
    if (submissionIds.length > 0 && env.IPATENT_DB) {
      const placeholders = submissionIds.map(() => "?").join(",");
      const { results } = await env.IPATENT_DB.prepare(
        `SELECT submission_id, title, abstract, status, created_at FROM submissions WHERE submission_id IN (${placeholders})`
      ).bind(...submissionIds).all();
      const bySubmissionId = Object.fromEntries(results.map(r => [r.submission_id, r]));
      enriched = (matches.matches || []).map(m => {
        const sid = m.metadata?.submission_id || m.id;
        const record = bySubmissionId[sid];
        return { id: m.id, score: m.score, submission_id: sid, title: record?.title || m.metadata?.title || null, abstract: record?.abstract || null, status: record?.status || null, created_at: record?.created_at || null };
      });
    }
    return new Response(JSON.stringify({ query, count: enriched.length, results: enriched }), { headers: ch });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: ch });
  }
}

export { worker_default as default };
