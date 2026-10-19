import { CORS_HEADERS, json, secretMatches } from "../lib.js";

const SQL = `SELECT id, timestamp, name, company, email, phone, range_text, tier, is_ref, incoming_ref, ref_code, answers
  FROM valuations ORDER BY id DESC LIMIT 500`;

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const secret = url.searchParams.get("secret") || "";
  if (!secretMatches(context.env, secret)) {
    return json({ ok: false, error: "unauthorized" }, 401);
  }
  if (!context.env.DB) return json({ ok: false, error: "Valuation storage is not configured." }, 500);

  let rows;
  try {
    const result = await context.env.DB.prepare(SQL).all();
    rows = result.results || [];
  } catch {
    return json({ ok: false, error: "Could not read valuations." }, 500);
  }

  const format = (url.searchParams.get("format") || "html").toLowerCase();
  if (format === "json") return json({ ok: true, valuations: rows });
  if (format === "csv") {
    return new Response(toCsv(rows), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": "attachment; filename=talentbridge-valuations.csv",
        ...CORS_HEADERS,
      },
    });
  }
  return new Response(toHtml(rows), {
    headers: { "Content-Type": "text/html; charset=utf-8", ...CORS_HEADERS },
  });
}

function toCsv(rows) {
  const headers = rows[0] ? Object.keys(rows[0]) : ["id"];
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((key) => csvCell(row[key])).join(","));
  }
  return lines.join("\n");
}

function csvCell(value) {
  const text = value == null ? "" : String(value);
  if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function toHtml(rows) {
  const headers = rows[0] ? Object.keys(rows[0]) : [];
  const head = headers.map((key) => `<th>${esc(key)}</th>`).join("");
  const body = rows
    .map((row) => `<tr>${headers.map((key) => `<td>${esc(row[key])}</td>`).join("")}</tr>`)
    .join("");
  return `<!doctype html>
<html lang="en">
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>TalentBridge valuations</title>
<style>
  body { margin: 0; background: #f5f3ec; color: #121212; font: 14px/1.4 "IBM Plex Sans", ui-sans-serif, system-ui, sans-serif; }
  main { padding: 24px; }
  h1 { font-weight: 500; font-size: 28px; margin: 0 0 8px; }
  p { color: #3d3d39; }
  .wrap { overflow: auto; border: 1px solid #dcd8cb; background: #fff; }
  table { border-collapse: collapse; min-width: 100%; }
  th, td { text-align: left; padding: 8px 10px; border-bottom: 1px solid #dcd8cb; vertical-align: top; }
  td { white-space: pre-wrap; max-width: 420px; }
  th { position: sticky; top: 0; background: #ebe8dd; white-space: nowrap; }
</style>
<main>
  <h1>TalentBridge valuations</h1>
  <p>${rows.length} row${rows.length === 1 ? "" : "s"}. These are business-data estimates, separate from RN apply leads.</p>
  <div class="wrap"><table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>
</main>`;
}

function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
