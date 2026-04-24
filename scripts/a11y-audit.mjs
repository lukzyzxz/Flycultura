#!/usr/bin/env node
/**
 * FlyCultura — A11y audit runner
 *
 * Roda axe-core e pa11y nas rotas principais e gera:
 *   a11y-report/index.html  — relatório consolidado
 *   a11y-report/critical.txt — lista de violações críticas (se houver)
 *   a11y-report/results.json — saída bruta
 *
 * O CI faz upload da pasta a11y-report como artifact e também
 * grava uma cópia em /mnt/documents/ se o caminho existir
 * (útil ao rodar localmente em ambiente Lovable).
 */

import { mkdirSync, writeFileSync, existsSync, cpSync } from "node:fs";
import { join } from "node:path";
import puppeteer from "puppeteer";
import { AxePuppeteer } from "@axe-core/puppeteer";
import pa11y from "pa11y";

const BASE = process.env.A11Y_BASE_URL || "http://localhost:4173";
const ROUTES = [
  "/",
  "/packages",
  "/deals",
  "/cart",
  "/auth",
  "/about",
  "/help",
  "/blog",
];
const OUT = "a11y-report";
mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage();
const all = [];
const critical = [];

for (const route of ROUTES) {
  const url = BASE + route;
  process.stdout.write(`→ ${url} ... `);
  try {
    await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });

    // axe-core
    const axe = await new AxePuppeteer(page)
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    // pa11y (WCAG2AA via HTMLCS)
    const pa = await pa11y(url, { standard: "WCAG2AA", runners: ["htmlcs"] });

    const violations = axe.violations.length;
    const issues = pa.issues.length;
    const crits = axe.violations.filter(v => v.impact === "critical");
    if (crits.length) critical.push({ route, count: crits.length, items: crits.map(c => c.id) });

    all.push({ route, axe, pa11y: pa });
    console.log(`axe=${violations} pa11y=${issues}${crits.length ? ` (CRITICAL=${crits.length})` : ""}`);
  } catch (err) {
    console.log(`ERROR: ${err.message}`);
    all.push({ route, error: err.message });
  }
}

await browser.close();

writeFileSync(join(OUT, "results.json"), JSON.stringify(all, null, 2));

if (critical.length) {
  writeFileSync(
    join(OUT, "critical.txt"),
    critical.map(c => `${c.route}: ${c.items.join(", ")}`).join("\n")
  );
}

// HTML report
const esc = (s) => String(s).replace(/[&<>]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]));
const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<title>FlyCultura · Relatório de acessibilidade</title>
<style>
 body{font:15px/1.5 system-ui;margin:2rem auto;max-width:1100px;padding:0 1rem;color:#0f172a}
 h1{color:#1e3a8a;border-bottom:3px solid #1e3a8a;padding-bottom:.4rem}
 h2{color:#1e40af;margin-top:2rem}
 table{border-collapse:collapse;width:100%;font-size:13px;margin:.5rem 0}
 th,td{border:1px solid #cbd5e1;padding:.5rem;text-align:left;vertical-align:top}
 th{background:#1e40af;color:#fff}
 .crit{color:#b91c1c;font-weight:700}
 .ok{color:#15803d;font-weight:700}
 details{margin:.5rem 0}
 code{background:#f1f5f9;padding:1px 5px;border-radius:3px}
</style></head><body>
<h1>FlyCultura — Relatório de acessibilidade</h1>
<p>Gerado em ${new Date().toLocaleString("pt-BR")} · Base: <code>${BASE}</code></p>
<table>
 <thead><tr><th>Rota</th><th>axe-core</th><th>pa11y</th><th>Status</th></tr></thead>
 <tbody>${all.map(r => {
   if (r.error) return `<tr><td>${esc(r.route)}</td><td colspan="2">ERRO: ${esc(r.error)}</td><td class="crit">FAIL</td></tr>`;
   const v = r.axe.violations.length, p = r.pa11y.issues.length;
   const crit = r.axe.violations.some(x => x.impact === "critical");
   return `<tr><td><a href="#${esc(r.route)}">${esc(r.route)}</a></td><td>${v}</td><td>${p}</td><td class="${crit ? 'crit' : (v||p ? '' : 'ok')}">${crit ? 'CRÍTICO' : (v||p ? 'AVISO' : 'OK')}</td></tr>`;
 }).join('')}</tbody>
</table>

${all.filter(r => !r.error).map(r => `
<h2 id="${esc(r.route)}">${esc(r.route)}</h2>
${r.axe.violations.length === 0 && r.pa11y.issues.length === 0
  ? '<p class="ok">✓ Sem violações detectadas</p>'
  : `
    <details ${r.axe.violations.some(v => v.impact === 'critical') ? 'open' : ''}><summary><strong>axe-core (${r.axe.violations.length})</strong></summary>
    <table><thead><tr><th>Regra</th><th>Impacto</th><th>Descrição</th><th>Nodes</th></tr></thead><tbody>
    ${r.axe.violations.map(v => `<tr><td><code>${esc(v.id)}</code></td><td class="${v.impact==='critical'?'crit':''}">${esc(v.impact||'')}</td><td>${esc(v.help)} <a href="${esc(v.helpUrl)}">↗</a></td><td>${v.nodes.length}</td></tr>`).join('')}
    </tbody></table></details>
    <details><summary><strong>pa11y (${r.pa11y.issues.length})</strong></summary>
    <table><thead><tr><th>Tipo</th><th>Código</th><th>Mensagem</th><th>Seletor</th></tr></thead><tbody>
    ${r.pa11y.issues.map(i => `<tr><td>${esc(i.type)}</td><td><code>${esc(i.code)}</code></td><td>${esc(i.message)}</td><td><code>${esc(i.selector)}</code></td></tr>`).join('')}
    </tbody></table></details>`}
`).join('')}

</body></html>`;
writeFileSync(join(OUT, "index.html"), html);

// Mirror to /mnt/documents in Lovable env
if (existsSync("/mnt/documents")) {
  cpSync(OUT, "/mnt/documents/a11y-report", { recursive: true });
  console.log("→ Cópia espelhada em /mnt/documents/a11y-report/");
}

console.log(`\nRelatório: ${join(OUT, "index.html")}`);
console.log(`Críticos:  ${critical.length}`);
process.exit(0);