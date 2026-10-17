export const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...CORS_HEADERS },
  });
}

export function isQualified(licensed, bedside) {
  return licensed === "yes" && bedside === "yes";
}

export function applyOutcome(licensed, bedside, desktop) {
  if (!isQualified(licensed, bedside)) return "not_qualified";
  if (desktop === "no") return "qualified_mobile";
  return "qualified_desktop";
}

export function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
}

export function appsScriptConfigured(env) {
  const url = env.APPS_SCRIPT_URL;
  return typeof url === "string" && url.startsWith("https://");
}

export async function callAppsScript(env, payload) {
  const url = env.APPS_SCRIPT_URL;
  if (!appsScriptConfigured(env)) {
    throw new Error("APPS_SCRIPT_URL is not configured");
  }
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      secret: env.APPLY_SECRET,
      ...payload,
    }),
  });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("Apps Script returned a non-JSON response");
  }
  if (!res.ok || data.ok === false) {
    throw new Error(data.error || `Apps Script HTTP ${res.status}`);
  }
  return data;
}
