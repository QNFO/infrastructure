// qnfo-lifecycle FIXED — v1.5
// Changes: Replaced CORS wildcard "Access-Control-Allow-Origin: *" with request Origin header

var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

function corsHeaders(origin) {
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": origin || "https://qnfo.org"
  };
}

var worker_default = {
  async fetch(request, env) {
    const u = new URL(request.url), p = u.pathname;
    const origin = request.headers.get("Origin") || "https://qnfo.org";
    const h = corsHeaders(origin);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: h });
    if (p === "/health") return health(env, origin);
    if (p === "/status") return handleStatus(env, origin);
    if (p === "/run/drift") return handleDrift(env, origin);
    if (p === "/run/backup") return handleBackup(env, origin);
    if (p === "/run/secrets-audit") return handleSecretsAudit(env, origin);
    if (p === "/run/ula-check") return handleUlaCheck(env, origin);
    return new Response(JSON.stringify({ error: "Not found" }), { status: 404, headers: h });
  },
  async scheduled(event, env, ctx) {
    // (unchanged cron handler)
    const cron = event.cron;
    console.log("[qnfo-lifecycle] cron triggered:", cron);
    try {
      if (cron === "0 3 * * *") await runLifecycle(env);
      else if (cron === "0 0 1 * * *") await runGraphSeed(env);
      else if (cron === "0 5 * * *") await runBackup(env);
      else if (cron === "0 6 * * *") await runDriftAudit(env);
      else if (cron === "0 7 * * *") await runUlaCheck(env);
      else if (cron === "0 8 * * 1") await runSecretsAudit(env);
      else if (cron === "0 * * * *") await runSync(env);
      else if (cron === "*/30 * * * *") await runPing(env);
    } catch (e) {
      console.error("[qnfo-lifecycle] cron error:", e.message);
    }
  }
};

function health(env, origin) {
  const h = corsHeaders(origin);
  return new Response(JSON.stringify({
    status: "ok",
    worker: "qnfo-lifecycle",
    version: "1.5-cors-fixed",
    cronSchedules: 8,
    features: ["lifecycle-scan", "graph-seed", "backup", "drift-audit-enhanced", "secrets-audit-enhanced", "registry-sync", "infra-ping", "ula-check"],
    bindings: { d1: ["qnfo-audit", "qnfo-graph", "portfolio-state", "living-paper"], r2: ["qnfo", "qnfo-audit", "qnfo-backups"] }
  }), { headers: h });
}
__name(health, "health");

async function handleStatus(env, origin) {
  const h = corsHeaders(origin);
  try {
    const project = await env.PORTFOLIO_STATE.prepare("SELECT COUNT(*) as total FROM resources WHERE type='project'").first();
    const audit = await env.QNFO_AUDIT.prepare("SELECT COUNT(*) as total FROM audit_sessions").first();
    return new Response(JSON.stringify({
      status: "ok",
      projects: project?.total || 0,
      auditSessions: audit?.total || 0,
      timestamp: (new Date()).toISOString()
    }), { headers: h });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: h });
  }
}
__name(handleStatus, "handleStatus");

async function handleDrift(env, origin) {
  const result = await runDriftAudit(env);
  return new Response(JSON.stringify(result), { headers: corsHeaders(origin) });
}
__name(handleDrift, "handleDrift");

async function handleSecretsAudit(env, origin) {
  const result = await runSecretsAudit(env);
  return new Response(JSON.stringify(result), { headers: corsHeaders(origin) });
}
__name(handleSecretsAudit, "handleSecretsAudit");

async function handleBackup(env, origin) {
  const result = await runBackup(env);
  return new Response(JSON.stringify(result), { headers: corsHeaders(origin) });
}
__name(handleBackup, "handleBackup");

async function handleUlaCheck(env, origin) {
  const result = await runUlaCheck(env);
  return new Response(JSON.stringify(result), { headers: corsHeaders(origin) });
}
__name(handleUlaCheck, "handleUlaCheck");

// (All run* functions remain unchanged — they don't return Responses directly)
async function runUlaCheck(env) {
  // ... (unchanged, same as original)
  console.log("[lifecycle] running ULA health check...");
  var result = {
    status: "ula-checked",
    timestamp: (new Date()).toISOString(),
    locations: {},
    findings: [],
    verdict: "HEALTHY"
  };
  var ULA_LOCATIONS = [
    { name: "legal.qnfo.org", url: "https://legal.qnfo.org/" },
    { name: "qnfo.org/legal/license", url: "https://qnfo.org/legal/license" },
    { name: "qwav.tech/legal/license", url: "https://qwav.tech/legal/license" }
  ];
  var CORRUPTION_PATTERNS = [
    { name: "th-ligature", regex: /\uFB05|\uFB06/g, desc: "Th/ff fi/fl ligatures" },
    { name: "Misplaced-ampersand", regex: /Misplaced &/g, desc: "Broken MathJax placeholder" },
    { name: "MathJax-unicode-range", regex: /[\uD835][\uDC00-\uDFFF]/g, desc: "MathJax Unicode surrogate pairs" }
  ];
  var EXPECTED_MIN_SIZE = 64000;
  for (var i = 0; i < ULA_LOCATIONS.length; i++) {
    var loc = ULA_LOCATIONS[i];
    try {
      var resp = await fetch(loc.url, { method: "GET", headers: { "User-Agent": "qnfo-lifecycle-ula-check/1.4" } });
      var body = await resp.text();
      var byteSize = new TextEncoder().encode(body).length;
      var locResult = { url: loc.url, httpStatus: resp.status, byteSize: byteSize, ok: resp.status === 200 && byteSize >= EXPECTED_MIN_SIZE };
      var detectedPatterns = [];
      for (var p = 0; p < CORRUPTION_PATTERNS.length; p++) {
        var pat = CORRUPTION_PATTERNS[p];
        var matches = body.match(pat.regex);
        if (matches && matches.length > 0) {
          detectedPatterns.push({ pattern: pat.name, count: matches.length, desc: pat.desc });
        }
      }
      if (detectedPatterns.length > 0) {
        locResult.corruptionDetected = detectedPatterns;
        locResult.ok = false;
        result.findings.push("CORRUPTION at " + loc.name + ": " + detectedPatterns.map(function(d) { return d.pattern + "(" + d.count + ")"; }).join(", "));
      }
      if (resp.status !== 200) result.findings.push("HTTP " + resp.status + " at " + loc.name);
      if (byteSize < EXPECTED_MIN_SIZE) result.findings.push("SIZE anomaly at " + loc.name + ": " + byteSize + " bytes");
      if (!body.includes("QNFO-ULA")) { result.findings.push("CONTENT mismatch at " + loc.name); locResult.ok = false; }
      result.locations[loc.name] = locResult;
    } catch (e) {
      result.locations[loc.name] = { url: loc.url, error: e.message, ok: false };
      result.findings.push("FETCH FAILED at " + loc.name + ": " + e.message);
    }
  }
  var allOk = Object.values(result.locations).every(function(l) { return l.ok; });
  result.verdict = allOk ? "HEALTHY" : "DEGRADED";
  try {
    await env.QNFO_AUDIT.prepare("INSERT INTO audit_sessions (session_id, agent, start_time, end_time, tasks_completed, tasks_total, notes) VALUES (?, ?, ?, ?, ?, ?, ?)").bind("ula-check-" + Date.now(), "qnfo-lifecycle-ula-cron", (new Date()).toISOString(), (new Date()).toISOString(), allOk ? 1 : 0, 1, "ULA check: " + result.verdict).run();
  } catch (e) { console.error("[lifecycle] ula-check audit log error:", e.message); }
  return result;
}
__name(runUlaCheck, "runUlaCheck");

async function runLifecycle(env) {
  console.log("[lifecycle] scanning inactive projects...");
  try {
    var now = new Date();
    var res = await env.PORTFOLIO_STATE.prepare("SELECT id, name, status, updated_at FROM resources WHERE type='project'").all();
    var staleCount = 0, archivedCount = 0;
    for (var i = 0; i < (res.results || []).length; i++) {
      var r = res.results[i];
      if (!r.updated_at) continue;
      var days = (now.getTime() - new Date(r.updated_at).getTime()) / 864e5;
      var newStatus = r.status;
      if (days >= 180) newStatus = "ARCHIVED";
      else if (days >= 90) newStatus = "STALE";
      else newStatus = "ACTIVE";
      if (newStatus !== r.status) {
        await env.PORTFOLIO_STATE.prepare("UPDATE resources SET status=?, updated_at=updated_at WHERE id=?").bind(newStatus, r.id).run();
        if (newStatus === "STALE") staleCount++;
        if (newStatus === "ARCHIVED") archivedCount++;
      }
    }
    console.log("[lifecycle] transitions: " + staleCount + " -> STALE, " + archivedCount + " -> ARCHIVED");
  } catch (e) { console.error("[lifecycle] runLifecycle error:", e.message); }
}
__name(runLifecycle, "runLifecycle");

async function runGraphSeed(env) {
  console.log("[lifecycle] re-seeding graph snapshot...");
  try {
    var nc = await env.QNFO_GRAPH.prepare("SELECT COUNT(*) as c FROM nodes").first();
    var ec = await env.QNFO_GRAPH.prepare("SELECT COUNT(*) as c FROM edges").first();
    await env.QNFO_AUDIT.prepare("INSERT INTO audit_sessions (session_id, agent, start_time, end_time, tasks_completed, tasks_total, notes) VALUES (?, ?, ?, ?, ?, ?, ?)").bind("graph-seed-" + Date.now(), "qnfo-lifecycle-cron", (new Date()).toISOString(), (new Date()).toISOString(), 1, 1, "Monthly graph snapshot: " + (nc?.c || 0) + " nodes, " + (ec?.c || 0) + " edges").run();
  } catch (e) { console.error("[lifecycle] runGraphSeed error:", e.message); }
}
__name(runGraphSeed, "runGraphSeed");

async function runBackup(env) {
  console.log("[lifecycle] running backup...");
  var dateStamp = (new Date()).toISOString().slice(0, 10);
  var results = {};
  try {
    var tables = [
      { db: env.PORTFOLIO_STATE, name: "portfolio-state", table: "resources" },
      { db: env.QNFO_AUDIT, name: "qnfo-audit", table: "audit_sessions" },
      { db: env.LIVING_PAPER, name: "living-paper", table: "papers" }
    ];
    for (var i = 0; i < tables.length; i++) {
      var t = tables[i];
      try {
        var rows = await t.db.prepare("SELECT * FROM " + t.table).all();
        var json = JSON.stringify(rows.results || []);
        await env.BACKUP_BUCKET.put(t.name + "/" + t.table + "-" + dateStamp + ".json", json, { httpMetadata: { contentType: "application/json" } });
        results[t.name] = rows.results?.length || 0;
      } catch (e) { results[t.name] = "error: " + e.message; }
    }
    return { status: "backup-complete", dateStamp: dateStamp, results: results };
  } catch (e) { return { status: "backup-failed", error: e.message }; }
}
__name(runBackup, "runBackup");

async function runDriftAudit(env) {
  console.log("[lifecycle] running ENHANCED drift audit...");
  var result = { status: "drift-checked", timestamp: (new Date()).toISOString(), portfolioState: {}, liveState: {}, drift: [], warnings: [] };
  try {
    var project = await env.PORTFOLIO_STATE.prepare("SELECT COUNT(*) as c FROM resources WHERE type='project'").first();
    var worker = await env.PORTFOLIO_STATE.prepare("SELECT COUNT(*) as c FROM resources WHERE type='worker'").first();
    var workerNames = await env.PORTFOLIO_STATE.prepare("SELECT name FROM resources WHERE type='worker'").all();
    result.portfolioState = { projects: project?.c || 0, workers: worker?.c || 0, workerNames: workerNames.results?.map(function(r) { return r.name; }) || [] };
  } catch (e) { result.warnings.push("portfolio-state query failed: " + e.message); }
  if (env.CF_API_TOKEN) {
    try {
      var apiResp = await fetch("https://api.cloudflare.com/client/v4/accounts/edb167b78c9fb901ea5bca3ce58ccc4b/workers/scripts", { headers: { Authorization: "Bearer " + env.CF_API_TOKEN, "Content-Type": "application/json" } });
      if (apiResp.ok) {
        var data = await apiResp.json();
        var liveWorkers = data.result || [];
        result.liveState = { workers: liveWorkers.length, workerNames: liveWorkers.map(function(w) { return w.id; }) };
        var portfolioNames = new Set(result.portfolioState.workerNames || []);
        var liveNames = new Set(result.liveState.workerNames || []);
        liveNames.forEach(function(lw) { if (!portfolioNames.has(lw)) result.drift.push({ type: "missing_in_portfolio", worker: lw }); });
        portfolioNames.forEach(function(pw) { if (!liveNames.has(pw)) result.drift.push({ type: "stale_in_portfolio", worker: pw }); });
      } else { result.warnings.push("Cloudflare API returned HTTP " + apiResp.status); }
    } catch (e) { result.warnings.push("Cloudflare API fetch failed: " + e.message); }
  } else { result.warnings.push("CF_API_TOKEN not configured - live comparison skipped"); }
  result.driftCount = result.drift.length;
  result.verdict = result.drift.length === 0 ? "CLEAN" : "DRIFT_DETECTED";
  try {
    await env.QNFO_AUDIT.prepare("INSERT INTO audit_sessions (session_id, agent, start_time, end_time, tasks_completed, tasks_total, notes) VALUES (?, ?, ?, ?, ?, ?, ?)").bind("drift-" + Date.now(), "qnfo-lifecycle-cron", (new Date()).toISOString(), (new Date()).toISOString(), result.drift.length === 0 ? 1 : 0, 1, "Drift audit: " + result.driftCount + " drifts. Verdict: " + result.verdict).run();
  } catch (e) {}
  return result;
}
__name(runDriftAudit, "runDriftAudit");

async function runSecretsAudit(env) {
  console.log("[lifecycle] running ENHANCED secrets audit...");
  var result = { status: "secrets-audited", timestamp: (new Date()).toISOString(), metadataStaleness: [], workerSecrets: [], findings: [], recommendations: [] };
  try {
    var stale = await env.PORTFOLIO_STATE.prepare("SELECT id, name FROM resources WHERE type='project' AND updated_at < datetime('now', '-180 days')").all();
    result.metadataStaleness = (stale.results || []).map(function(r) { return r.name; });
    if (result.metadataStaleness.length > 0) result.findings.push(result.metadataStaleness.length + " projects with stale metadata (>180d)");
  } catch (e) { result.findings.push("Metadata staleness check error: " + e.message); }
  if (env.CF_API_TOKEN) {
    try {
      var apiResp = await fetch("https://api.cloudflare.com/client/v4/accounts/edb167b78c9fb901ea5bca3ce58ccc4b/workers/scripts", { headers: { Authorization: "Bearer " + env.CF_API_TOKEN, "Content-Type": "application/json" } });
      if (apiResp.ok) {
        var data = await apiResp.json();
        var workers = data.result || [];
        for (var i = 0; i < workers.length; i++) {
          var w = workers[i];
          try {
            var secretsResp = await fetch("https://api.cloudflare.com/client/v4/accounts/edb167b78c9fb901ea5bca3ce58ccc4b/workers/scripts/" + w.id + "/secrets", { headers: { Authorization: "Bearer " + env.CF_API_TOKEN } });
            if (secretsResp.ok) {
              var secretsData = await secretsResp.json();
              var secrets = secretsData.result || [];
              result.workerSecrets.push({ worker: w.id, secretCount: secrets.length, secretNames: secrets.map(function(s) { return s.name; }) });
              for (var s = 0; s < secrets.length; s++) {
                var sn = secrets[s];
                var nameUpper = (sn.name || "").toUpperCase();
                if (nameUpper.includes("TOKEN") || nameUpper.includes("API_KEY") || nameUpper.includes("SECRET")) {
                  result.findings.push("High-risk secret '" + sn.name + "' in Worker '" + w.id + "' - verify rotation age");
                }
              }
            }
          } catch (e) { result.findings.push("Failed to query secrets for " + w.id + ": " + e.message); }
        }
      }
    } catch (e) { result.findings.push("Cloudflare API fetch failed: " + e.message); }
  } else { result.recommendations.push("CF_API_TOKEN not configured - Worker secrets audit skipped"); }
  var DOCUMENTED_SECRETS = ["CLOUDFLARE_API_TOKEN", "GITHUB_TOKEN", "ZENODO_API_TOKEN", "BUFFER_ACCESS_TOKEN", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "PINATA_API_KEY", "PINATA_API_SECRET", "PINATA_JWT", "GOOGLE_OAUTH_CLIENT_ID", "GOOGLE_OAUTH_CLIENT_SECRET", "BUFFER_CLIENT_ID", "BUFFER_CLIENT_SECRET", "ADMIN_API_TOKEN", "ADMIN_TOKEN", "CF_API_TOKEN"];
  var documentedSet = new Set(DOCUMENTED_SECRETS.map(function(s) { return s.toUpperCase(); }));
  for (var i = 0; i < result.workerSecrets.length; i++) {
    var ws = result.workerSecrets[i];
    for (var j = 0; j < ws.secretNames.length; j++) {
      if (!documentedSet.has(ws.secretNames[j].toUpperCase())) {
        result.findings.push("UNDOCUMENTED secret '" + ws.secretNames[j] + "' in Worker '" + ws.worker + "'");
      }
    }
  }
  result.recommendations.push("Rotation check: secrets older than 90 days need rotation.");
  result.totalFindings = result.findings.length;
  result.totalRecommendations = result.recommendations.length;
  try {
    await env.QNFO_AUDIT.prepare("INSERT INTO audit_sessions (session_id, agent, start_time, end_time, tasks_completed, tasks_total, notes) VALUES (?, ?, ?, ?, ?, ?, ?)").bind("secrets-" + Date.now(), "qnfo-lifecycle-cron", (new Date()).toISOString(), (new Date()).toISOString(), 1, 1, "Secrets audit: " + result.totalFindings + " findings").run();
  } catch (e) {}
  return result;
}
__name(runSecretsAudit, "runSecretsAudit");

async function runSync(env) { console.log("[lifecycle] syncing registry..."); }
__name(runSync, "runSync");

async function runPing(env) {
  console.log("[lifecycle] infra ping...");
  var targets = ["https://qnfo-gateway.q08.workers.dev/health", "https://qnfo-archive.q08.workers.dev/health"];
  for (var i = 0; i < targets.length; i++) {
    try { var r = await fetch(targets[i], { method: "GET" }); if (!r.ok) console.error("[lifecycle] PING FAIL " + targets[i] + ": HTTP " + r.status); }
    catch (e) { console.error("[lifecycle] PING ERROR " + targets[i] + ": " + e.message); }
  }
}
__name(runPing, "runPing");

export { worker_default as default };
