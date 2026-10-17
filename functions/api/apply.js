import { applyOutcome, appsScriptConfigured, callAppsScript, CORS_HEADERS, json, validEmail } from "../lib.js";

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

  const firstName = String(body.firstName || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const phone = String(body.phone || "").trim();
  const licensed = body.licensed === "yes" || body.licensed === "no" ? body.licensed : "";
  const bedside = body.bedside === "yes" || body.bedside === "no" ? body.bedside : "";
  const state = String(body.state || "").trim();
  const desktop = body.desktop === "yes" || body.desktop === "no" ? body.desktop : "";
  const consent = body.consent === true;

  if (!firstName) return json({ ok: false, error: "Enter your first name." }, 400);
  if (!validEmail(email)) return json({ ok: false, error: "Enter a valid email address." }, 400);
  if (!licensed) return json({ ok: false, error: "Choose Yes or No for RN license." }, 400);
  if (!bedside) return json({ ok: false, error: "Choose Yes or No for bedside experience." }, 400);
  if (!desktop) return json({ ok: false, error: "Choose Yes or No for laptop/desktop." }, 400);
  if (!consent) return json({ ok: false, error: "Please agree to continue." }, 400);

  const outcome = applyOutcome(licensed, bedside, desktop);
  const utm = body.utm && typeof body.utm === "object" ? body.utm : {};
  const lead = {
    timestamp: new Date().toISOString(),
    firstName,
    email,
    phone,
    licensed,
    bedside,
    state,
    desktop,
    consent,
    utm,
    outcome,
  };

  if (env.APPS_SCRIPT_URL) {
    try {
      const data = await callAppsScript(env, { action: "apply", ...lead });
      return json({
        ok: true,
        outcome,
        emailSent: Boolean(data.emailSent),
      });
    } catch {
      return json({ ok: false, error: "Could not save your application. Please try again." }, 502);
    }
  }

  if (env.LEADS) {
    const id = `${Date.now()}-${crypto.randomUUID()}`;
    await env.LEADS.put(`lead:${id}`, JSON.stringify(lead));
    return json({ ok: true, outcome, emailSent: false, queued: true });
  }

  return json({
    ok: true,
    outcome,
    emailSent: false,
    stored: false,
  });
}
