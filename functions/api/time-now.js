import { CORS_HEADERS, json } from "../lib.js";

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function onRequestPost(context) {
  const { env, request } = context;
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "Invalid JSON" }, 400);
  }

  const token = String(body.token || "").trim();
  const answer = body.answer === "yes" || body.answer === "no" ? body.answer : "";
  if (!token) return json({ ok: false, error: "Missing token" }, 400);
  if (!answer) return json({ ok: false, error: "Choose Yes or No." }, 400);
  if (!env.DB) return json({ ok: false, error: "Lead storage is not configured." }, 500);

  try {
    const row = await env.DB.prepare("SELECT id FROM leads WHERE applied_token = ?").bind(token).first();
    if (!row) return json({ ok: false, error: "Unknown lead" }, 404);
    await env.DB.prepare("UPDATE leads SET time_now = ? WHERE id = ?").bind(answer, row.id).run();
  } catch {
    return json({ ok: false, error: "Could not save your answer." }, 500);
  }

  return json({ ok: true, time_now: answer });
}
