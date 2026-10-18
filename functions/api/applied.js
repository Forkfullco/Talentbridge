import { CORS_HEADERS, json } from "../lib.js";

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

async function markApplied(env, token) {
  const value = String(token || "").trim();
  if (!value) return json({ ok: false, error: "Missing token" }, 400);
  if (!env.DB) return json({ ok: false, error: "Lead storage is not configured." }, 500);
  try {
    const row = await env.DB.prepare(
      "SELECT status, stopped FROM leads WHERE applied_token = ?",
    )
      .bind(value)
      .first();
    if (!row) return json({ ok: false, error: "Could not update your status. The link may have expired." }, 404);
    if (row.status === "Applied" || row.stopped === "yes") {
      return json({ ok: true, already: true });
    }
    await env.DB.prepare(
      "UPDATE leads SET status = 'Applied', stopped = 'yes', email_status = 'stopped' WHERE applied_token = ?",
    )
      .bind(value)
      .run();
    return json({ ok: true, already: false });
  } catch {
    return json({ ok: false, error: "Could not update your status. The link may have expired." }, 500);
  }
}

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  return markApplied(context.env, url.searchParams.get("t") || url.searchParams.get("token"));
}

export async function onRequestPost(context) {
  let body = {};
  try {
    body = await context.request.json();
  } catch {
    body = {};
  }
  const url = new URL(context.request.url);
  const token = body.token || url.searchParams.get("t") || url.searchParams.get("token");
  return markApplied(context.env, token);
}
