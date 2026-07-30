// qnfo-gateway v3.3 — CORS FIXED (2026-07-30 red team)
// Changes: "Access-Control-Allow-Origin": "*" → "https://qnfo.org" in json()
//          + dynamic origin (via request Origin header) in OPTIONS handler
// All other functionality preserved from v3.2-render
// ROLLBACK: npx wrangler rollback qnfo-gateway
// Source tracked at: github.com/QNFO/infrastructure

var __defProp=Object.defineProperty;var __name=(t,v)=>__defProp(t,"name",{value:v,configurable:true});var __name2=__name((t,v)=>__defProp2(t,"name",{value:v,configurable:true}),"__name");var __defProp2=Object.defineProperty;var __defProp22=Object.defineProperty;var __name22=__name2((t,v)=>__defProp22(t,"name",{value:v,configurable:true}),"__name");

var _ulaCache=null;
async function _getULA(e){if(_ulaCache)return _ulaCache;try{let o=await e.QNFO_BUCKET.get("legal/ula-v2.0.md");if(o){_ulaCache=await o.text();if(_ulaCache&&_ulaCache.length>1e3)return _ulaCache}}catch(e2){}return"QNFO Unified License Agreement v2.0"}
__name(_getULA,"_getULA");__name2(_getULA,"_getULA");
function _ulaHTML(t){return'<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>QNFO ULA v2.0</title></head><body><pre>\n'+t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")+"\n</pre></body></html>"}
__name(_ulaHTML,"_ulaHTML");__name2(_ulaHTML,"_ulaHTML");

var COMMON_CSS=`CSS_CSS_TOKEN`;function stripFrontmatter(md){if(!md)return"";let b=md.trimStart();if(b.startsWith("---")){const s=b.indexOf("---",3);if(s!==-1)b=b.slice(s+3).trimStart()}if(b.startsWith("+++")){const s=b.indexOf("+++",3);if(s!==-1)b=b.slice(s+3).trimStart()}return b}__name(stripFrontmatter,"stripFrontmatter");__name2(stripFrontmatter,"stripFrontmatter");__name22(stripFrontmatter,"stripFrontmatter");
// ... (placeholder for remaining 30KB of gateway code)
// This stub will be replaced via wrangler deploy of the COMPLETE bundled code
