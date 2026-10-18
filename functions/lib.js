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

export function applyOutcome(licensed, _bedside, desktop) {
  if (licensed !== "yes") return "not_qualified";
  if (desktop === "no") return "qualified_mobile";
  return "qualified_desktop";
}

export function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
}

export function secretMatches(env, provided) {
  const expected = String(env.APPLY_SECRET || "");
  const got = String(provided || "");
  if (!expected || expected.length !== got.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ got.charCodeAt(i);
  return diff === 0;
}

export function utmValue(utm, key) {
  if (!utm || typeof utm !== "object") return "";
  return String(utm[key] || "").trim().slice(0, 200);
}
