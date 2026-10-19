// reports/*/01_PRD.md 의 머리말(title·date·audience·summary)을 읽어 루트 index.html 목록을 만든다.
// 사용: node scripts/build-index.mjs
import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const reportsDir = join(root, "reports");

function frontMatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return {};
  return Object.fromEntries(
    m[1].split(/\r?\n/)
      .map((line) => line.match(/^(\w+):\s*(.*)$/))
      .filter(Boolean)
      .map(([, k, v]) => [k, v.trim()])
  );
}

const esc = (s = "") =>
  s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

const reports = (existsSync(reportsDir) ? readdirSync(reportsDir, { withFileTypes: true }) : [])
  .filter((d) => d.isDirectory() && existsSync(join(reportsDir, d.name, "01_PRD.md")))
  .map((d) => ({ dir: d.name, ...frontMatter(readFileSync(join(reportsDir, d.name, "01_PRD.md"), "utf8")) }))
  .sort((a, b) => (b.date || "").localeCompare(a.date || ""));

const cards = reports.length
  ? reports.map((r) => `
    <article class="card">
      <span class="date">${esc(r.date)} · ${esc(r.audience)}</span>
      <a class="title" href="reports/${encodeURI(r.dir)}/">${esc(r.title || r.dir)}</a>
      <p>${esc(r.summary)}</p>
      <span class="links"><a href="reports/${encodeURI(r.dir)}/">보고자료</a> · <a href="reports/${encodeURI(r.dir)}/01_PRD.md">PRD</a> · <a href="reports/${encodeURI(r.dir)}/00_원문.md">원문</a></span>
    </article>`).join("")
  : `<p class="empty">아직 보고자료가 없습니다.</p>`;

const html = `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>보고자료 모음</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css">
<style>
:root { --navy:#003879; --ink:#111; --sub:#555b66; --line:#d9dde3; --page:#eef0f3; --card:#fff; }
* { box-sizing: border-box; }
body { margin:0; background:var(--page); color:var(--ink); font-family:"Pretendard","Noto Sans KR",system-ui,sans-serif; line-height:1.6; word-break:keep-all; }
header { background:var(--navy); color:#fff; padding:40px 16px; }
header div, main { max-width:960px; margin:0 auto; }
header h1 { margin:0; font-size:28px; }
header p { margin:8px 0 0; opacity:.85; }
.pipe { margin-top:16px; font-size:14px; opacity:.75; }
main { padding:24px 16px 64px; display:grid; gap:16px; }
.card { background:var(--card); border:1px solid var(--line); border-radius:6px; padding:20px 24px; }
.card:hover { border-color:var(--navy); }
.card .title { display:block; font-size:19px; font-weight:700; color:var(--navy); margin:4px 0; text-decoration:none; }
.card .title:hover { text-decoration:underline; }
.card p { margin:0 0 8px; }
.date, .links { font-size:13px; color:var(--sub); }
.links a { color:var(--navy); }
.empty { color:var(--sub); }
</style>
</head>
<body>
<header><div>
  <h1>보고자료 모음</h1>
  <p>생각나는 대로 쓴 텍스트를 PRD로 정리하고, 같은 PRD로 보고자료를 만든다.</p>
  <p class="pipe">원문 → PRD → 웹 보고자료 · Figma 초안</p>
</div></header>
<main>${cards}
</main>
</body>
</html>
`;

writeFileSync(join(root, "index.html"), html);
console.log(`index.html 갱신: 보고자료 ${reports.length}건`);
