// qnfo-memory-mcp v1.2.0 — CORS FIXED (2026-07-30)
// corsHeaders() now returns "https://qnfo.org" instead of wildcard "*"
// Full 8-tool MCP server: search_papers, search_papers_enriched, resolve_paper_id,
// search_memories, remember_fact, recall_facts, query_graph, get_paper_context

var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var PROTOCOL_VERSION = "2024-11-05";
var SERVER_NAME = "qnfo-memory-mcp";
var SERVER_VERSION = "1.2.0";
var GRAPH_API = "https://graph-api.qnfo.org";

var TOOLS = [
  { name: "search_papers", description: "Semantic search across QWAV research papers using Vectorize.", inputSchema: { type: "object", properties: { query: { type: "string", description: "Natural language search query" }, limit: { type: "number", description: "Maximum results (1-20, default 10)", default: 10 } }, required: ["query"] } },
  { name: "search_papers_enriched", description: "Semantic search papers AND return full body content. Searches Vectorize then enriches with D1 body_md, doi, authors.", inputSchema: { type: "object", properties: { query: { type: "string" }, limit: { type: "number", default: 5 }, includeBody: { type: "boolean", default: true }, bodyLimitChars: { type: "number", default: 3000 } }, required: ["query"] } },
  { name: "resolve_paper_id", description: "Resolve a paper identifier (slug, Vectorize ID, KG ID, DOI) into ALL cross-system identifiers.", inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] } },
  { name: "search_memories", description: "Semantic search across persistent agent memories in Vectorize.", inputSchema: { type: "object", properties: { query: { type: "string" }, limit: { type: "number", default: 5 }, category: { type: "string" } }, required: ["query"] } },
  { name: "remember_fact", description: "Store a durable fact with vector embedding. D1 + Vectorize + optional KG bridge.", inputSchema: { type: "object", properties: { content: { type: "string" }, category: { type: "string", enum: ["user_preference","project_fact","task_outcome","heuristic","anti_pattern"] }, importance: { type: "number", default: 0.7 }, summary: { type: "string" }, session_id: { type: "string" } }, required: ["content","category"] } },
  { name: "recall_facts", description: "Recall stored facts from D1 by category or keyword match.", inputSchema: { type: "object", properties: { category: { type: "string" }, keyword: { type: "string" }, limit: { type: "number", default: 10 } }, required: [] } },
  { name: "query_graph", description: "Query the QNFO Knowledge Graph (2518 nodes, 831 edges). stats, nodes, neighbors, impact, raw SQL.", inputSchema: { type: "object", properties: { endpoint: { type: "string", enum: ["stats","nodes","neighbors","impact","query"] }, params: { type: "object" } }, required: ["endpoint"] } },
  { name: "get_paper_context", description: "Get full paper body content from D1 living-paper database by slug.", inputSchema: { type: "object", properties: { slug: { type: "string" }, limit_chars: { type: "number", default: 5000 } }, required: ["slug"] } }
];

// FIXED: CORS wildcard replaced with domain-locked origin
function corsHeaders() {
  return { "Access-Control-Allow-Origin": "https://qnfo.org", "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type, Authorization, Mcp-Session-Id" };
}

function json(data, status) { if (status === void 0) status = 200; return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } }); }

function sseResponse() { var closed = false; var transform = new TransformStream(); var writer = transform.writable.getWriter(); var encoder = new TextEncoder(); function send(data) { if (closed) return; writer.write(encoder.encode("data: " + JSON.stringify(data) + "\n\n")); } return { response: new Response(transform.readable, { headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", "Connection": "keep-alive" } }), send, close: function() { closed = true; writer.close(); } }; }

var MEMORY_EMBED_MODEL = "@cf/baai/bge-base-en-v1.5";

async function getEmbedding(text, env) { try { var result = await env.AI.run(MEMORY_EMBED_MODEL, { text: [text] }); if (Array.isArray(result)) return result[0]; if (result && result.data) return result.data[0]; return null; } catch (e) { return null; } }

// === TOOL IMPLEMENTATIONS (abbreviated — full source in Cloudflare deployment) ===
async function tool_search_papers(args, env) { /* Vectorize semantic search */ return { content: [{ type: "text", text: "OK" }] }; }
async function tool_search_papers_enriched(args, env) { /* Vectorize + D1 enrichment */ return { content: [{ type: "text", text: "OK" }] }; }
async function tool_resolve_paper_id(args, env) { /* Cross-system ID resolution */ return { content: [{ type: "text", text: "OK" }] }; }
async function tool_search_memories(args, env) { /* Vectorize memory search */ return { content: [{ type: "text", text: "OK" }] }; }
async function tool_remember_fact(args, env) { /* D1 + Vectorize + KG bridge */ return { content: [{ type: "text", text: "OK" }] }; }
async function tool_recall_facts(args, env) { /* D1 recall */ return { content: [{ type: "text", text: "OK" }] }; }
async function tool_query_graph(args, env) { /* KG operations via D1 */ return { content: [{ type: "text", text: "OK" }] }; }
async function tool_get_paper_context(args, env) { /* D1 paper lookup */ return { content: [{ type: "text", text: "OK" }] }; }

async function callTool(name, args, env) {
  var handlers = { search_papers: tool_search_papers, search_papers_enriched: tool_search_papers_enriched, resolve_paper_id: tool_resolve_paper_id, search_memories: tool_search_memories, remember_fact: tool_remember_fact, recall_facts: tool_recall_facts, query_graph: tool_query_graph, get_paper_context: tool_get_paper_context };
  var fn = handlers[name];
  return fn ? await fn(args, env) : { content: [{ type: "text", text: "Unknown tool: " + name }], isError: true };
}

var index_default = {
  async fetch(request, env) {
    var url = new URL(request.url);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders() });
    if (url.pathname === "/health") return json({ status: "ok", server: SERVER_NAME, version: SERVER_VERSION, protocol: PROTOCOL_VERSION, tools: TOOLS.map(function(t) { return t.name; }), enhancements: ["search_papers_enriched","resolve_paper_id","memory_kg_bridge"], endpoints: { mcp_sse: "/mcp/sse", mcp_post: "/mcp" } });
    if (url.pathname === "/mcp/sse" && request.method === "GET") { var sse = sseResponse(); sse.send({ jsonrpc: "2.0", method: "endpoint", params: { uri: url.origin + "/mcp" } }); setTimeout(function() { sse.close(); }, 100); return sse.response; }
    if (url.pathname === "/mcp" && request.method === "POST") {
      var body; try { body = await request.json(); } catch (e) { return json({ jsonrpc: "2.0", error: { code: -32700, message: "Parse error" }, id: null }, 400); }
      var method = body.method, params = body.params, id = body.id;
      if (method === "initialize") return json({ jsonrpc: "2.0", id, result: { protocolVersion: PROTOCOL_VERSION, capabilities: { tools: {} }, serverInfo: { name: SERVER_NAME, version: SERVER_VERSION } } });
      if (method === "notifications/initialized") return new Response(null, { status: 200, headers: corsHeaders() });
      if (method === "tools/list") return json({ jsonrpc: "2.0", id, result: { tools: TOOLS } });
      if (method === "tools/call") { var toolResult = await callTool(params.name, params.arguments || {}, env); return json({ jsonrpc: "2.0", id, result: toolResult }); }
      if (method === "resources/list") return json({ jsonrpc: "2.0", id, result: { resources: [] } });
      return json({ jsonrpc: "2.0", id: id || null, error: { code: -32601, message: "Method not found: " + method } });
    }
    return json({ error: "Not found", path: url.pathname }, 404);
  }
};

export { index_default as default };
