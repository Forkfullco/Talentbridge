import { applyOutcome, CORS_HEADERS, json, utmValue, validEmail } from "../lib.js";
import { DRIP_HOURS, sendLeadEmail } from "../mail.js";

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

  const firstName = String(body.firstName || "").trim().slice(0, 120);
  const email = String(body.email || "").trim().toLowerCase().slice(0, 200);
  const phone = String(body.phone || "").trim().slice(0, 40);
  const licensed = body.licensed === "yes" || body.licensed === "no" ? body.licensed : "";
  const bedside = body.bedside === "yes" || body.bedside === "no" ? body.bedside : "";
  const state = String(body.state || "").trim().slice(0, 80);
  const desktop = body.desktop === "yes" || body.desktop === "no" ? body.desktop : "";
  const consent = body.consent === true;

  if (!firstName) return json({ ok: false, error: "Enter your first name." }, 400);
  if (!validEmail(email)) return json({ ok: false, error: "Enter a valid email address." }, 400);
  if (!licensed) return json({ ok: false, error: "Choose Yes or No for RN license." }, 400);
  if (!bedside) return json({ ok: false, error: "Choose Yes or No for bedside experience." }, 400);
  if (!desktop) return json({ ok: false, error: "Choose Yes or No for laptop/desktop." }, 400);
  if (!consent) return json({ ok: false, error: "Please agree to continue." }, 400);
  if (!env.DB) return json({ ok: false, error: "Lead storage is not configured." }, 500);

  const outcome = applyOutcome(licensed, bedside, desktop);
  const qualified = outcome !== "not_qualified";
  const now = new Date();
  const token = crypto.randomUUID().replace(/-/g, "");
  const hour = 60 * 60 * 1000;
  const emailStatus = qualified ? "needs_provider" : "";

  try {
    await env.DB.prepare(
      `INSERT INTO leads (
        timestamp, first_name, email, phone, licensed, bedside, state, desktop, consent,
        utm_source, utm_medium, utm_campaign, utm_content, utm_term,
        status, applied_token, email_status, email1_due, email2_due, email3_due, stopped
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
      .bind(
        now.toISOString(),
        firstName,
        email,
        phone,
        licensed,
        bedside,
        state,
        desktop,
        "yes",
        utmValue(body.utm, "utm_source"),
        utmValue(body.utm, "utm_medium"),
        utmValue(body.utm, "utm_campaign"),
        utmValue(body.utm, "utm_content"),
        utmValue(body.utm, "utm_term"),
        qualified ? "New" : "Not qualified",
        token,
        emailStatus,
        qualified ? now.toISOString() : "",
        qualified ? new Date(now.getTime() + DRIP_HOURS[2] * hour).toISOString() : "",
        qualified ? new Date(now.getTime() + DRIP_HOURS[3] * hour).toISOString() : "",
        "",
      )
      .run();
  } catch {
    return json({ ok: false, error: "Could not save your application. Please try again." }, 500);
  }

  const row = await env.DB.prepare("SELECT id FROM leads WHERE applied_token = ?").bind(token).first();
  let emailSent = false;
  let emailStatusFinal = emailStatus;
  if (qualified) {
    const sent = await sendLeadEmail(env, 1, {
      first_name: firstName,
      email,
      applied_token: token,
    });
    emailSent = sent.ok;
    emailStatusFinal = sent.ok ? "sent_1" : env.RESEND_API_KEY ? "send_failed" : "needs_provider";
  } else {
    const sent = await sendLeadEmail(env, "not_fit", {
      first_name: firstName,
      email,
      applied_token: token,
    });
    emailStatusFinal = sent.ok ? "not_fit_sent" : "";
  }
  if (row && emailStatusFinal !== emailStatus) {
    await env.DB.prepare("UPDATE leads SET email_status = ? WHERE id = ?").bind(emailStatusFinal, row.id).run();
  }

  return json({
    ok: true,
    outcome,
    emailSent,
    stored: true,
  });
}
