var __defProp = Object.defineProperty;
var __name = (t, v) => __defProp(t, "name", { value: v, configurable: true });
var __name2 = __name((t, v) => __defProp2(t, "name", { value: v, configurable: true }), "__name");
var __defProp2 = Object.defineProperty;
var COMMON_CSS = `:root{--blue:#1a56db;--blue-dark:#1040a8;--blue-light:#dbeafe;--blue-subtle:#eff6ff;--text:#1a1a2e;--text-muted:#6b7280;--bg:#ffffff;--surface:#f9fafb;--border:#e5e7eb;--radius:8px;--radius-lg:12px}
*,*::before,*::after{box-sizing:border-box}
body{font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;margin:0;padding:0;color:var(--text);background:var(--bg);line-height:1.65;-webkit-font-smoothing:antialiased}
.top-nav{display:flex;align-items:center;gap:1.5rem;padding:.85rem 1.5rem;background:rgba(255,255,255,.92);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-bottom:1px solid var(--border);position:sticky;top:0;z-index:100;flex-wrap:wrap}
.top-nav a{color:var(--text-muted);text-decoration:none;font-weight:500;font-size:.875rem;padding:.4rem .75rem;border-radius:6px;transition:all .15s}
.top-nav a:hover{color:var(--blue);background:var(--blue-subtle)}
.top-nav .brand{font-weight:800;font-size:1.1rem;color:var(--text);text-decoration:none;margin-right:auto;padding:0}
.qwav-badge{background:linear-gradient(135deg,#1a56db,#1040a8)!important;color:#fff!important;font-weight:600!important;font-size:.8rem!important;padding:.35rem .7rem!important;border-radius:6px!important}
.container{max-width:860px;margin:0 auto;padding:1.5rem}
h1{font-size:1.8rem;border-bottom:2px solid var(--border);padding-bottom:.6rem;margin-bottom:1rem}
h2{font-size:1.3rem;margin-top:2rem;margin-bottom:.75rem;color:var(--text)}
h3{font-size:1.1rem;margin-top:1.5rem;margin-bottom:.5rem}
.paper-list{list-style:none;padding:0}
.paper-item{padding:1rem 0;border-bottom:1px solid var(--border);display:flex;flex-direction:column;gap:.25rem}
.paper-item a.paper-title{color:var(--blue);text-decoration:none;font-size:1.05rem;font-weight:600}
.paper-item a.paper-title:hover{text-decoration:underline}
.paper-meta{color:var(--text-muted);font-size:.82rem;display:flex;flex-wrap:wrap;gap:.5rem;align-items:center}
.paper-abstract{color:#4b5563;font-size:.88rem;line-height:1.5;margin-top:.25rem}
.paper-category{display:inline-block;background:var(--blue-subtle);color:var(--blue);padding:.15rem .6rem;border-radius:999px;font-size:.75rem;font-weight:500}
.hub-hero{text-align:center;padding:3rem 1.5rem 2rem;background:linear-gradient(135deg,#eff6ff 0%,#f0f9ff 50%,#faf5ff 100%)}
.hub-hero h1{font-size:2.4rem;border:none;margin-bottom:.5rem;background:linear-gradient(135deg,#1a56db,#7c3aed);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.hub-hero .subtitle{font-size:1.15rem;color:var(--text-muted);max-width:600px;margin:0 auto 1.5rem}
.hub-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1rem;padding:1.5rem 0}
.hub-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:1.25rem;transition:all .2s}
.hub-card:hover{border-color:var(--blue);box-shadow:0 2px 12px rgba(26,86,219,.08);transform:translateY(-1px)}
.hub-card h3{font-size:1.05rem;margin:0 0 .5rem;color:var(--blue)}
.hub-card p{color:var(--text-muted);font-size:.88rem;margin:0}
.latest-papers{list-style:none;padding:0;margin:0}
.latest-papers li{padding:.6rem 0;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;gap:.5rem}
.latest-papers a{color:var(--blue);text-decoration:none;font-weight:500;font-size:.92rem}
.latest-papers a:hover{text-decoration:underline}
.latest-papers .date{color:var(--text-muted);font-size:.78rem;white-space:nowrap}`;

function stripFrontmatter(md) { if (!md) return ""; let b = md.trimStart(); if (b.startsWith("---")) { const s = b.indexOf("---", 3); if (s !== -1) b = b.slice(s + 3).trimStart(); } if (b.startsWith("+++")) { const s = b.indexOf("+++", 3); if (s !== -1) b = b.slice(s + 3).trimStart(); } return b; }

function esc(t) { if (!t) return ""; return String(t).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
function escAttr(t) { if (!t) return ""; return String(t).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
function xmlEscape(t) { if (!t) return ""; return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;"); }

function detectCategory(title, abstract) {
  const t = ((title || "") + " " + (abstract || "")).toLowerCase();
  if (t.includes("error correction") || t.includes("stabilizer") || t.includes("fault-tolerant") || t.includes("qec") || t.includes("ldpc") || t.includes("surface code")) return "qec";
  if (t.includes("number theory") || t.includes("p-adic") || t.includes("adelic") || t.includes("ostrowski") || t.includes("tate") || t.includes("gamma function") || t.includes("morita") || t.includes("langlands")) return "number-theory";
  if (t.includes("physics") || t.includes("quantum field") || t.includes("quantum gravity") || t.includes("wheeler-dewitt") || t.includes("zbw") || t.includes("zitterbewegung") || t.includes("topological") || t.includes("majorana") || t.includes("holograph")) return "physics";
  if (t.includes("algorithm") || t.includes("machine learning") || t.includes("cryptograph") || t.includes("benchmark") || t.includes("verification") || t.includes("lwe") || t.includes("neural network") || t.includes("computation")) return "computer-science";
  return "other";
}

var CATEGORY_LABELS = { "qec": "QEC", "number-theory": "Number Theory", "physics": "Physics", "computer-science": "CS", "other": "Other" };

function _mdInline(t) {
  t = esc(t || "");
  t = t.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');
  t = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  t = t.replace(/__([^_]+)__/g, "<strong>$1</strong>");
  t = t.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  t = t.replace(/_([^_]+)_/g, "<em>$1</em>");
  t = t.replace(/~~([^~]+)~~/g, "<del>$1</del>");
  t = t.replace(/`([^`]+)`/g, "<code>$1</code>");
  return t;
}

function renderMarkdown(md) {
  if (!md) return "";
  var mb = [], m = md;
  m = m.replace(/```(\w*)\n([\s\S]*?)```/g, function(_, l2, c2) { mb.push("<pre" + (l2 ? ' class="lang-' + l2 + '"' : "") + "><code>" + c2.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") + "</code></pre>"); return "\x01B" + mb.length + "\x01"; });
  m = m.replace(/\$\$([\s\S]*?)\$\$/g, function(_, c2) { mb.push('<div class="math-display">\\[' + c2.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") + "\\]</div>"); return "\x01B" + mb.length + "\x01"; });
  var o = "", L = m.split("\n"), i = 0;
  while (i < L.length) { var l = L[i], t = l.trim(); if (!t) { i++; continue; }
    if (t[0] === ">") { o += "<blockquote>"; while (i < L.length && L[i].trim()[0] === ">") { o += "<p>" + _mdInline(L[i].trim().replace(/^>\s?/, "")) + "</p>"; i++; } o += "</blockquote>"; continue; }
    if (t.indexOf("|") >= 0 && i + 1 < L.length && /^\|?[\s:]*-{3,}[\s:]*\|/.test(L[i + 1].trim())) { o += "<table><thead><tr>"; var hs = t.split("|").map(x => x.trim()).filter(x => x); for (var h = 0; h < hs.length; h++) o += "<th>" + _mdInline(hs[h]) + "</th>"; o += "</tr></thead><tbody>"; i += 2; while (i < L.length && L[i].trim().indexOf("|") >= 0) { o += "<tr>"; var cs = L[i].trim().split("|").map(x => x.trim()).filter(x => x); for (var c = 0; c < cs.length; c++) o += "<td>" + _mdInline(cs[c]) + "</td>"; o += "</tr>"; i++; } o += "</tbody></table>"; continue; }
    var hm = t.match(/^(#{1,4})\s+(.+)/); if (hm) { o += "<h" + (hm[1].length + 1) + ">" + _mdInline(hm[2]) + "</h" + (hm[1].length + 1) + ">"; i++; continue; }
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(t)) { o += "<hr>"; i++; continue; }
    if (/^[-*+]\s/.test(t)) { o += "<ul>"; while (i < L.length && /^[-*+]\s/.test(L[i].trim())) { o += "<li>" + _mdInline(L[i].trim().replace(/^[-*+]\s/, "")) + "</li>"; i++; } o += "</ul>"; continue; }
    if (/^\d+\.\s/.test(t)) { o += "<ol>"; while (i < L.length && /^\d+\.\s/.test(L[i].trim())) { o += "<li>" + _mdInline(L[i].trim().replace(/^\d+\.\s/, "")) + "</li>"; i++; } o += "</ol>"; continue; }
    o += "<p>" + _mdInline(t) + "</p>"; i++; }
  o = o.replace(/\x01B(\d+)\x01/g, function(_, n) { return mb[parseInt(n) - 1] || ""; });
  return o;
}

function renderHubHTML(recentPapers) {
  const cards = [
    { icon: "\u{1F4DC}", title: "Research Papers", desc: "Browse 918+ publications across number theory, physics, QEC, and computer science.", href: "/papers" },
    { icon: "\u{1F310}", title: "Knowledge Graph", desc: "Explore the QNFO concept graph — 2,500+ nodes, 1,500+ relationships.", href: "/graph" },
    { icon: "\u2696\uFE0F", title: "License", desc: "QNFO Unified License Agreement v2.0", href: "/legal" },
    { icon: "\u{1F4E6}", title: "Archive", desc: "Persistent archival storage with DOI registration.", href: "https://archive.qnfo.org" },
    { icon: "\u{1F9E0}", title: "QWAV Deep", desc: "AI-powered research exploration.", href: "https://qwav.org" },
    { icon: "\u{1F52C}", title: "iPatent.me", desc: "Quantum technology patent disclosure framework.", href: "https://ipatent.me" }
  ];
  const ch = cards.map(c => '<a href="' + c.href + '" class="hub-card" style="text-decoration:none;color:inherit;display:block"><div class="card-icon">' + c.icon + '</div><h3>' + c.title + '</h3><p>' + c.desc + '</p></a>').join("");
  let ph = "";
  if (recentPapers && recentPapers.length > 0) {
    ph = '<div class="hub-section-header" style="margin-top:1rem">Latest Papers</div><ul class="latest-papers">' + recentPapers.slice(0, 8).map(p => '<li><a href="/papers/' + escAttr(p.slug) + '">' + esc(p.title) + '</a><span class="date">' + esc((p.created_at || "").slice(0, 10)) + '</span></li>').join("") + '</ul><p style="text-align:center;margin-top:.75rem"><a href="/papers" style="color:var(--blue);text-decoration:none;font-weight:500">View all 918+ papers →</a></p>';
  }
  return '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>QNFO — Research Foundation</title><meta name="description" content="QNFO Research Foundation"><meta property="og:title" content="QNFO — Research Foundation"><link rel="canonical" href="https://qnfo.org"><style>' + COMMON_CSS + '</style></head><body><nav class="top-nav"><a class="brand" href="/">🔬 QNFO</a><a href="/papers">Papers</a><a href="/graph">Knowledge Graph</a><a href="https://qwav.org" class="qwav-badge">QWAV Deep</a><a href="https://archive.qnfo.org">Archive</a><a href="/legal">License</a><a href="https://ipatent.me">iPatent</a></nav><div class="hub-hero"><h1>QNFO Research Foundation</h1><p class="subtitle">Exploring the foundations of physics through p-adic mathematics, ultrametric geometry, topological quantum computation, and condensed mathematics.</p></div><div class="container"><div class="hub-cards">' + ch + '</div>' + ph + '</div><footer class="site-footer"><div class="footer-links"><a href="/papers">Papers</a><a href="/graph">Knowledge Graph</a><a href="/legal">License</a><a href="https://qwav.org">QWAV</a><a href="https://archive.qnfo.org">Archive</a></div><p>Licensed under <a href="/legal">QNFO-ULA v2.0</a><br>&copy; 2025-2026 QNFO Research Foundation</p></footer></body></html>';
}

function renderIndexHTML(papers, activeCategory, searchQuery) {
  const fb = ["all","qec","number-theory","physics","computer-science","other"].map(cat => { const label = cat === "all" ? "All" : CATEGORY_LABELS[cat] || cat; const isActive = !activeCategory && cat === "all" || activeCategory === cat; const href = cat === "all" ? "/papers" : "/papers?category=" + cat; return '<a href="' + href + '" class="filter-btn' + (isActive ? " active" : "") + '">' + label + '</a>'; }).join("");
  const sv = searchQuery ? escAttr(searchQuery) : "";
  const rows = papers.map(p => { const cat = detectCategory(p.title, p.abstract); const cl = CATEGORY_LABELS[cat] || ""; const ab = (p.abstract || "").slice(0, 280); return '<li class="paper-item"><a class="paper-title" href="/papers/' + escAttr(p.slug) + '">' + esc(p.title) + '</a><div class="paper-meta"><span>' + esc((p.created_at || "").slice(0, 10)) + '</span>' + (p.doi ? '<span>· DOI: <a href="https://doi.org/' + escAttr(p.doi) + '">' + esc(p.doi) + '</a></span>' : "") + (cl ? '<span class="paper-category">' + cl + '</span>' : "") + '</div>' + (ab ? '<div class="paper-abstract">' + esc(ab) + '</div>' : "") + '</li>'; }).join("");
  const title = searchQuery ? 'Search: "' + esc(searchQuery) + '" — QNFO Papers' : activeCategory ? (CATEGORY_LABELS[activeCategory] || activeCategory) + " Papers — QNFO" : "QNFO Papers";
  return '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>' + title + '</title><meta name="description" content="QNFO research papers"><link rel="canonical" href="https://papers.qnfo.org/papers"><link rel="alternate" type="application/rss+xml" title="QNFO Papers RSS" href="/rss.xml"><style>' + COMMON_CSS + '</style></head><body><nav class="top-nav"><a class="brand" href="https://qnfo.org">🔬 QNFO</a><a href="/papers">Papers</a><a href="https://qwav.org" class="qwav-badge">QWAV Deep</a><a href="https://archive.qnfo.org">Archive</a><a href="https://legal.qnfo.org">License</a></nav><div class="container"><h1>' + (searchQuery ? 'Search: "' + esc(searchQuery) + '"' : activeCategory ? (CATEGORY_LABELS[activeCategory] || activeCategory) + " Papers" : "QNFO Papers") + '</h1><div class="filter-bar">' + fb + '</div><form method="get" action="/papers"><input type="text" name="search" class="search-box" placeholder="Search papers..." value="' + sv + '"></form><h2>' + papers.length + ' papers</h2><ul class="paper-list">' + rows + '</ul></div><footer class="site-footer"><p>QNFO Papers · <a href="/rss.xml">RSS</a> · <a href="/sitemap.xml">Sitemap</a><br>Licensed under <a href="https://legal.qnfo.org">QNFO-ULA v2.0</a></p></footer></body></html>';
}

function renderPaperHTML(paper) {
  const cleanMd = stripFrontmatter(paper.body_md || "");
  const md = cleanMd.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const abstract = (paper.abstract || "").slice(0, 300);
  const dateStr = paper.created_at ? paper.created_at.slice(0, 10) : "Unknown";
  return '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>' + esc(paper.title) + ' — QNFO Papers</title><meta name="description" content="' + escAttr(abstract) + '"><meta property="og:title" content="' + escAttr(paper.title) + '"><link rel="canonical" href="https://papers.qnfo.org/papers/' + escAttr(paper.slug) + '"><style>' + COMMON_CSS + '</style></head><body><nav class="top-nav"><a class="brand" href="https://qnfo.org">🔬 QNFO</a><a href="/papers">Papers</a><a href="https://qwav.org" class="qwav-badge">QWAV Deep</a></nav><div class="paper-body"><a class="back-link" href="/papers">← All papers</a><article><h1>' + esc(paper.title) + '</h1><div class="paper-meta">' + (paper.doi ? '<strong>DOI:</strong> <a href="https://doi.org/' + escAttr(paper.doi) + '">' + esc(paper.doi) + '</a><br>' : "") + '<strong>Published:</strong> ' + dateStr + '</div><div class="rendered-md">' + renderMarkdown(md) + '</div></article></div></body></html>';
}

// CORS FIXED: wildcard replaced with domain-locked origin
function json(data, status) {
  status = status || 200;
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "https://qnfo.org" }
  });
}

async function handlePapers(request, env) {
  try {
    const u = new URL(request.url);
    const category = u.searchParams.get("category");
    const search = (u.searchParams.get("search") || "").trim();
    const limit = Math.min(parseInt(u.searchParams.get("limit") || "50"), 200);
    var sql = "SELECT slug,title,doi,abstract,created_at,status,version,authors FROM papers WHERE slug IS NOT NULL";
    const params = [];
    if (search) { sql += " AND (title LIKE ? OR abstract LIKE ? OR authors LIKE ?)"; const term = "%" + search + "%"; params.push(term, term, term); }
    sql += " ORDER BY created_at DESC LIMIT ?"; params.push(limit);
    const res = await env.LIVING_PAPER.prepare(sql).bind.apply(env.LIVING_PAPER.prepare(sql), params).all();
    var results = res.results;
    var filtered = results;
    if (category && category !== "all") { filtered = results.filter(function(p) { return detectCategory(p.title, p.abstract) === category; }); }
    const accept = request.headers.get("Accept") || "";
    if (accept.includes("text/html") || !accept.includes("application/json") && !u.searchParams.has("format")) {
      return new Response(renderIndexHTML(filtered, category || null, search), { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, max-age=300" } });
    }
    return json({ papers: filtered, count: filtered.length, category: category || null, search: search || null });
  } catch (e) { return json({ error: e.message }, 500); }
}

async function handlePaperDetail(request, env, path, url) {
  const slug = path.split("/")[2];
  if (!slug) return json({ error: "Missing paper slug" }, 400);
  try {
    const paper = await env.LIVING_PAPER.prepare("SELECT slug,title,body_md,abstract,authors,doi,created_at,status,version FROM papers WHERE slug = ? LIMIT 1").bind(slug).first();
    if (!paper) return json({ error: "Paper not found", slug }, 404);
    const accept = request.headers.get("Accept") || "";
    if (accept.includes("text/html") || !accept.includes("application/json")) { return new Response(renderPaperHTML(paper), { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, max-age=3600" } }); }
    return json(paper);
  } catch (e) { return json({ error: e.message }, 500); }
}

async function handleHub(env) {
  try { const res = await env.LIVING_PAPER.prepare("SELECT slug,title,created_at FROM papers WHERE slug IS NOT NULL ORDER BY created_at DESC LIMIT 8").all(); return new Response(renderHubHTML(res.results), { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, max-age=300" } }); }
  catch (e) { return new Response(renderHubHTML([]), { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, max-age=60" } }); }
}

async function handleSitemap(env, url) {
  try { const res = await env.LIVING_PAPER.prepare("SELECT slug, created_at FROM papers WHERE slug IS NOT NULL ORDER BY created_at DESC").all(); const base = "https://papers.qnfo.org"; const all = [{ loc: base + "/", priority: "1.0" }, { loc: base + "/papers", priority: "0.9" }].concat(res.results.map(p => ({ loc: base + "/papers/" + encodeURIComponent(p.slug), lastmod: p.created_at ? new Date(p.created_at).toISOString().slice(0, 10) : "", priority: "0.8" }))); const body = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + all.map(u => "  <url>\n    <loc>" + xmlEscape(u.loc) + "</loc>" + (u.lastmod ? "\n    <lastmod>" + u.lastmod + "</lastmod>" : "") + "\n    <priority>" + u.priority + "</priority>\n  </url>").join("\n") + "\n</urlset>"; return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" } }); }
  catch (e) { return new Response('<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>', { status: 500, headers: { "Content-Type": "application/xml; charset=utf-8" } }); }
}

function handlePapersRobots(url) { return new Response("User-agent: *\nAllow: /\nSitemap: https://papers.qnfo.org/sitemap.xml\n", { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=86400" } }); }

async function handleLlmsTxt(env, url) {
  try { const res = await env.LIVING_PAPER.prepare("SELECT slug,title,doi,abstract,created_at FROM papers WHERE slug IS NOT NULL ORDER BY created_at DESC LIMIT 200").all(); const base = "https://papers.qnfo.org"; var body = "# QNFO Papers\n\n> Research across p-adic mathematics, ultrametric geometry, topological quantum computation.\n\n## Papers\n\n"; body += res.results.map(p => "- [" + p.title + "](" + base + "/papers/" + encodeURIComponent(p.slug) + ")" + (p.doi ? " (DOI: " + p.doi + ")" : "")).join("\n"); return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } }); }
  catch (e) { return new Response("# QNFO Papers\n\nIndex temporarily unavailable.\n", { status: 500, headers: { "Content-Type": "text/plain; charset=utf-8" } }); }
}

async function handleRss(env, url) {
  try { const res = await env.LIVING_PAPER.prepare("SELECT slug,title,doi,abstract,created_at FROM papers WHERE slug IS NOT NULL ORDER BY created_at DESC LIMIT 50").all(); const base = "https://papers.qnfo.org"; const now = (new Date()).toUTCString(); const items = res.results.map(p => { var pubDate = now; try { pubDate = new Date(p.created_at).toUTCString(); } catch (e) {} const link = base + "/papers/" + encodeURIComponent(p.slug); return "  <item>\n    <title>" + xmlEscape(p.title) + "</title>\n    <link>" + xmlEscape(link) + '</link>\n    <guid isPermaLink="true">' + xmlEscape(link) + "</guid>\n    <description>" + xmlEscape(p.abstract || "") + "</description>\n    <pubDate>" + pubDate + "</pubDate>\n  </item>"; }).join("\n"); const body = '<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n<channel>\n  <title>QNFO Papers</title>\n  <link>' + base + "/papers</link>\n  <description>Latest QNFO research publications</description>\n  <lastBuildDate>" + now + "</lastBuildDate>\n" + items + "\n</channel>\n</rss>"; return new Response(body, { headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=3600" } }); }
  catch (e) { return new Response('<?xml version="1.0"?><rss version="2.0"><channel></channel></rss>', { status: 500, headers: { "Content-Type": "application/rss+xml; charset=utf-8" } }); }
}

function health(env) { return json({ status: "ok", worker: "qnfo-gateway", version: "3.3-cors-fixed" }); }

async function handleLegal(path, env) {
  const body = await env.QNFO_BUCKET.get("legal/ula-v2.0.md").then(o => o ? o.text() : "QNFO Unified License Agreement v2.0\nFull text at https://legal.qnfo.org");
  const ct = path === "/plain" || path === "/text" ? "text/plain; charset=utf-8" : "text/html; charset=utf-8";
  return new Response(path === "/plain" || path === "/text" ? await body : '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>QNFO ULA v2.0</title></head><body><pre>' + (await body).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") + "</pre></body></html>", { headers: { "Content-Type": ct, "Cache-Control": "public, max-age=86400" } });
}

async function handleAskAI(request, env) {
  if (!env.AI) return json({ error: "AI binding not configured" }, 503);
  const body = await request.json().catch(() => ({}));
  const slug = body.slug, question = body.question;
  if (!question || !question.trim()) return json({ error: "Missing question" }, 400);
  try {
    var paperTitle = "", paperBody = "";
    if (slug) { const paper = await env.LIVING_PAPER.prepare("SELECT title,body_md,abstract FROM papers WHERE slug = ? LIMIT 1").bind(slug).first(); if (paper) { paperTitle = paper.title || ""; paperBody = (stripFrontmatter(paper.body_md) || paper.abstract || "").slice(0, 6000); } }
    const result = await env.AI.run("@cf/meta/llama-3.1-8b-instruct-fp8", { messages: [{ role: "system", content: 'You are a research assistant for a QNFO paper titled "' + paperTitle + '".' }, { role: "user", content: question + "\n\nPaper content: " + paperBody }] });
    const answer = result && result.response || "No response generated.";
    return json({ answer, slug: slug || null });
  } catch (e) { return json({ error: e.message }, 500); }
}

async function handleStats(env) {
  try { const nc = await env.DB.prepare("SELECT COUNT(*) as count FROM nodes").first(); const ec = await env.DB.prepare("SELECT COUNT(*) as count FROM edges").first(); const nl = await env.DB.prepare("SELECT DISTINCT label FROM nodes ORDER BY label").all(); const et = await env.DB.prepare("SELECT DISTINCT relationship_type FROM edges ORDER BY relationship_type").all(); return json({ totalNodes: nc && nc.count || 0, totalEdges: ec && ec.count || 0, nodeLabels: nl.results.map(r => r.label), relationshipTypes: et.results.map(r => r.relationship_type) }); }
  catch (e) { return json({ error: e.message }, 500); }
}

function sjp(str) { if (!str) return {}; try { return JSON.parse(str); } catch (e) { return {}; } }

async function handleNodesList(url, env) { const label = url.searchParams.get("label"); const search = url.searchParams.get("search"); const limit = Math.min(parseInt(url.searchParams.get("limit") || "100"), 500); var sql = "SELECT id,name,label,properties FROM nodes"; const conds = [], pars = []; if (label) { conds.push("label = ?"); pars.push(label); } if (search) { conds.push("name LIKE ?"); pars.push("%" + search + "%"); } if (conds.length) sql += " WHERE " + conds.join(" AND "); sql += " ORDER BY name LIMIT ?"; pars.push(limit); const res = await env.DB.prepare(sql).bind.apply(env.DB.prepare(sql), pars).all(); return json({ nodes: res.results.map(function(r) { r.properties = sjp(r.properties); return r; }), count: res.results.length }); }

async function handleNodeGet(id, env) { const node = await env.DB.prepare("SELECT id,name,label,properties FROM nodes WHERE id = ? OR name = ?").bind(id, id).first(); if (!node) return json({ error: "Node not found: " + id }, 404); const rels = await env.DB.prepare("SELECT e.id,e.relationship_type,e.properties, CASE WHEN e.source_id = ? THEN 'outgoing' ELSE 'incoming' END as direction, CASE WHEN e.source_id = ? THEN e.target_id ELSE e.source_id END as other_id FROM edges e WHERE e.source_id = ? OR e.target_id = ? ORDER BY e.relationship_type").bind(node.id, node.id, node.id, node.id).all(); return json({ id: node.id, name: node.name, label: node.label, properties: sjp(node.properties), relationships: rels.results.map(r => ({ id: r.id, type: r.relationship_type, direction: r.direction, otherId: r.other_id, properties: sjp(r.properties) })) }); }

async function handleNeighbors(id, env) { const node = await env.DB.prepare("SELECT id,name,label FROM nodes WHERE id = ? OR name = ?").bind(id, id).first(); if (!node) return json({ error: "Node not found: " + id }, 404); const nbrs = await env.DB.prepare("SELECT DISTINCT n.id,n.name,n.label,n.properties,e.relationship_type, CASE WHEN e.source_id = ? THEN 'outgoing' ELSE 'incoming' END as direction FROM edges e JOIN nodes n ON (CASE WHEN e.source_id = ? THEN e.target_id ELSE e.source_id END) = n.id WHERE e.source_id = ? OR e.target_id = ? ORDER BY n.label,n.name").bind(node.id, node.id, node.id, node.id).all(); return json({ node: { id: node.id, name: node.name, label: node.label }, neighbors: nbrs.results.map(n => ({ id: n.id, name: n.name, label: n.label, relationshipType: n.relationship_type, direction: n.direction, properties: sjp(n.properties) })), count: nbrs.results.length }); }

async function handleEdges(url, env) { const type = url.searchParams.get("type"); const source = url.searchParams.get("source"); const target = url.searchParams.get("target"); const limit = Math.min(parseInt(url.searchParams.get("limit") || "100"), 500); const conds = [], pars = []; if (type) { conds.push("e.relationship_type = ?"); pars.push(type); } if (source) { conds.push("e.source_id = ?"); pars.push(source); } if (target) { conds.push("e.target_id = ?"); pars.push(target); } var sql = "SELECT e.id,e.source_id,e.target_id,e.relationship_type,e.properties FROM edges e"; if (conds.length) sql += " WHERE " + conds.join(" AND "); sql += " ORDER BY e.relationship_type LIMIT ?"; pars.push(limit); const res = await env.DB.prepare(sql).bind.apply(env.DB.prepare(sql), pars).all(); return json({ edges: res.results.map(function(e) { e.properties = sjp(e.properties); return e; }), count: res.results.length }); }

async function handleImpact(name, env) { const node = await env.DB.prepare("SELECT id,name,label FROM nodes WHERE id = ? OR name = ?").bind(name, name).first(); if (!node) return json({ error: "Node not found: " + name }, 404); const deps = [], visited = new Set([node.id]); var queue = [node.id], depth = 0; while (queue.length > 0 && depth < 10) { depth++; const nq = []; for (var i = 0; i < queue.length; i++) { const cid = queue[i]; const edges = await env.DB.prepare("SELECT e.id,e.source_id,e.target_id,e.relationship_type,e.properties, n.name as source_name,n.label as source_label, n2.name as target_name,n2.label as target_label FROM edges e JOIN nodes n ON e.source_id=n.id JOIN nodes n2 ON e.target_id=n2.id WHERE e.source_id = ?").bind(cid).all(); for (var j = 0; j < edges.results.length; j++) { const edge = edges.results[j]; if (!visited.has(edge.target_id)) { visited.add(edge.target_id); deps.push({ id: edge.target_id, name: edge.target_name, label: edge.target_label, relationshipType: edge.relationship_type, depth }); nq.push(edge.target_id); } } } queue = nq; } return json({ node: { id: node.id, name: node.name, label: node.label }, dependents: deps, totalDependents: deps.length, maxDepth: depth }); }

async function handleQuery(request, env) { const body = await request.json().catch(() => ({})); const query = body.query; const qParams = body.params; if (!query) return json({ error: "Missing query" }, 400); try { var stmt = env.DB.prepare(query); if (qParams && qParams.length) stmt = stmt.bind.apply(stmt, qParams); const res = await stmt.all(); return json(res); } catch (e) { return json({ error: e.message }, 400); } }

async function handleSync(request, env) { const body = await request.json().catch(() => ({})); const action = body.action, nodes = body.nodes || [], edges = body.edges || []; if (action !== "bulk") return json({ error: "Only bulk sync supported" }, 400); const results = { nodesInserted: 0, edgesInserted: 0, errors: [] }; for (var i = 0; i < nodes.length; i++) { const node = nodes[i]; try { await env.DB.prepare("INSERT INTO nodes (id,name,label,properties) VALUES (?,?,?,?) ON CONFLICT(id) DO UPDATE SET name=excluded.name,label=excluded.label,properties=excluded.properties").bind(node.id, node.name, node.label, typeof node.properties === "object" ? JSON.stringify(node.properties) : node.properties || "{}").run(); results.nodesInserted++; } catch (e) { results.errors.push("Node " + node.id + ": " + e.message); } } for (var j = 0; j < edges.length; j++) { const edge = edges[j]; try { await env.DB.prepare("INSERT INTO edges (id,source_id,target_id,relationship_type,properties) VALUES (?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET source_id=excluded.source_id,target_id=excluded.target_id,relationship_type=excluded.relationship_type,properties=excluded.properties").bind(edge.id, edge.source_id, edge.target_id, edge.relationship_type, typeof edge.properties === "object" ? JSON.stringify(edge.properties) : edge.properties || "{}").run(); results.edgesInserted++; } catch (e) { results.errors.push("Edge " + edge.id + ": " + e.message); } } return json({ success: true, nodesInserted: results.nodesInserted, edgesInserted: results.edgesInserted, errors: results.errors }); }

// CORS FIXED: fetch handler uses dynamic origin for OPTIONS, domain-locked for all json() responses
var qnfo_gateway_v3_default = {
  async fetch(request, env) {
    const u = new URL(request.url);
    const p = u.pathname.replace(/\/+$/, "") || "/";
    const origin = request.headers.get("Origin") || "https://qnfo.org";
    const h = { "Content-Type": "application/json", "Access-Control-Allow-Origin": origin };
    const host = u.hostname;
    const method = request.method.toUpperCase();
    if (method === "OPTIONS") { return new Response(null, { status: 204, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": origin, "Access-Control-Allow-Methods": "GET,POST,OPTIONS", "Access-Control-Allow-Headers": "Content-Type,User-Agent" } }); }
    if (host === "legal.qnfo.org") return handleLegal(p, env);
    if (host === "papers.qnfo.org" || host === "qnfo-publications.pages.dev") {
      if (p === "/api/ask" && method === "POST") return handleAskAI(request, env);
      if (p === "/sitemap.xml") return handleSitemap(env, u);
      if (p === "/robots.txt") return handlePapersRobots(u);
      if (p === "/llms.txt") return handleLlmsTxt(env, u);
      if (p === "/rss.xml" || p === "/feed.xml") return handleRss(env, u);
      if (p.startsWith("/papers/") && p.split("/").length >= 3) return handlePaperDetail(request, env, p, u);
      if (p === "/papers" || p === "/") return handlePapers(request, env);
      return handlePapers(request, env);
    }
    if (host === "graph-api.qnfo.org") {
      try {
        if ((method === "GET" || method === "HEAD") && p === "/stats") return handleStats(env);
        if (method === "POST" && p === "/query") return handleQuery(request, env);
        if (method === "POST" && p === "/sync") return handleSync(request, env);
        if (method === "GET" && p === "/nodes") return handleNodesList(u, env);
        if (method === "GET" && p.startsWith("/nodes/")) return handleNodeGet(p.replace("/nodes/", ""), env);
        if (method === "GET" && p.startsWith("/neighbors/")) return handleNeighbors(p.replace("/neighbors/", ""), env);
        if (method === "GET" && p === "/edges") return handleEdges(u, env);
        if (method === "GET" && p.startsWith("/impact/")) return handleImpact(p.replace("/impact/", ""), env);
        if (p === "/" || p === "/health") return json({ status: "ok", version: "3.0", database: "qnfo-graph" });
        return json({ error: "Not found", path: p }, 404);
      } catch (e) { return json({ error: e.message }, 500); }
    }
    if (host === "qnfo.org" || host === "www.qnfo.org") {
      if (p === "/health") return health(env);
      if (p === "/legal" || p === "/license") return handleLegal(p, env);
      if (p === "/api/ask" && method === "POST") return handleAskAI(request, env);
      if (p.startsWith("/papers/") && p.split("/").length >= 3) return handlePaperDetail(request, env, p, u);
      if (p === "/papers" || p.startsWith("/papers?")) return handlePapers(request, env);
      if (method === "GET" && p === "/stats") return handleStats(env);
      if (method === "POST" && p === "/query") return handleQuery(request, env);
      if (method === "POST" && p === "/sync") return handleSync(request, env);
      if (method === "GET" && p === "/nodes") return handleNodesList(u, env);
      if (method === "GET" && p.startsWith("/nodes/")) return handleNodeGet(p.replace("/nodes/", ""), env);
      if (method === "GET" && p.startsWith("/neighbors/")) return handleNeighbors(p.replace("/neighbors/", ""), env);
      if (method === "GET" && p === "/edges") return handleEdges(u, env);
      if (method === "GET" && p.startsWith("/impact/")) return handleImpact(p.replace("/impact/", ""), env);
      if (p === "/graph") return new Response(null, { status: 302, headers: { Location: "https://graph-api.qnfo.org/stats" } });
      if (p === "/" || p === "") return handleHub(env);
      return json({ error: "Not found", path: p }, 404);
    }
    // Fallback routes
    if (p === "/health") return health(env);
    if (p === "/legal" || p === "/license") return handleLegal(p, env);
    if (p === "/api/ask" && method === "POST") return handleAskAI(request, env);
    if (p.startsWith("/papers/") && p.split("/").length >= 3) return handlePaperDetail(request, env, p, u);
    if (p.startsWith("/papers") || p === "/") return handlePapers(request, env);
    if (p === "/sitemap.xml") return handleSitemap(env, u);
    if (p === "/robots.txt") return handlePapersRobots(u);
    if (p === "/llms.txt") return handleLlmsTxt(env, u);
    if (p === "/rss.xml" || p === "/feed.xml") return handleRss(env, u);
    if (method === "GET" && p === "/stats") return handleStats(env);
    if (method === "POST" && p === "/query") return handleQuery(request, env);
    if (method === "POST" && p === "/sync") return handleSync(request, env);
    if (method === "GET" && p === "/nodes") return handleNodesList(u, env);
    if (method === "GET" && p.startsWith("/nodes/")) return handleNodeGet(p.replace("/nodes/", ""), env);
    if (method === "GET" && p.startsWith("/neighbors/")) return handleNeighbors(p.replace("/neighbors/", ""), env);
    if (method === "GET" && p === "/edges") return handleEdges(u, env);
    if (method === "GET" && p.startsWith("/impact/")) return handleImpact(p.replace("/impact/", ""), env);
    return json({ error: "Not found", path: p }, 404);
  }
};

__name(json, "json"); __name(handlePapers, "handlePapers"); __name(handlePaperDetail, "handlePaperDetail"); __name(handleHub, "handleHub"); __name(handleStats, "handleStats");
export { qnfo_gateway_v3_default as default };
