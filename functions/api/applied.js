import { appsScriptConfigured, callAppsScript, CORS_HEADERS, json } from "../lib.js";

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

async function markApplied(env, token) {
  const value = String(token || "").trim();
  if (!value) return json({ ok: false, error: "Missing token" }, 400);
  if (!appsScriptConfigured(env)) {
    return json({ ok: true, already: false, queued: true });
  }
  try {
    const data = await callAppsScript(env, { action: "applied", token: value });
    return json({ ok: true, already: Boolean(data.already) });
  } catch {
    return json({ ok: false, error: "Could not update your status. The link may have expired." }, 502);
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
