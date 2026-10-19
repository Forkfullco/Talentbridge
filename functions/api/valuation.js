import { CORS_HEADERS, json, validEmail } from "../lib.js";
import { sendResend } from "../mail.js";

const TO = "talent@talentbridgeremote.com";

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

  const contact = body.contact || {};
  const name = String(contact.name || "").trim().slice(0, 120);
  const company = String(contact.company || "").trim().slice(0, 160);
  const email = String(contact.email || "").trim().toLowerCase().slice(0, 200);
  const phone = String(contact.phone || "").trim().slice(0, 40);
  const range = String(body.range || "").trim().slice(0, 40);
  const tier = String(body.tier || "").trim().slice(0, 40);
  const isRef = body.isRef === true;
  const incomingRef = String(body.incomingRef || "").trim().slice(0, 40);
  const answers = body.answers && typeof body.answers === "object" ? body.answers : {};

  if (!name || !company) return json({ ok: false, error: "We need a name, a company and an email that works." }, 400);
  if (!validEmail(email)) return json({ ok: false, error: "We need a name, a company and an email that works." }, 400);
  if (!env.DB) return json({ ok: false, error: "Could not save your valuation. Please try again." }, 500);

  const origin = new URL(request.url).origin;
  const code = crypto.randomUUID().replace(/-/g, "").slice(0, 8);
  const refLink = isRef ? `${origin}/valuation?ref=${code}` : null;
  const answersJson = JSON.stringify(answers).slice(0, 20000);

  try {
    await env.DB.prepare(
      `INSERT INTO valuations (
        timestamp, name, company, email, phone, range_text, tier, is_ref, incoming_ref, ref_code, answers
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
      .bind(
        new Date().toISOString(),
        name,
        company,
        email,
        phone,
        range,
        tier,
        isRef ? "yes" : "no",
        incomingRef,
        isRef ? code : "",
        answersJson,
      )
      .run();
  } catch {
    return json({ ok: false, error: "Could not save your valuation. Please try again." }, 500);
  }

  const summary = [
    `Name: ${name}`,
    `Company: ${company}`,
    `Email: ${email}`,
    phone ? `Phone: ${phone}` : "",
    `Range shown: ${range}`,
    `Tier: ${tier}`,
    `Introducing a company: ${isRef ? "yes" : "no"}`,
    incomingRef ? `Came in through intro: ${incomingRef}` : "",
    refLink ? `Their intro link: ${refLink}` : "",
    "",
    "Answers:",
    JSON.stringify(answers, null, 2),
  ]
    .filter(Boolean)
    .join("\n");

  const internal = await sendResend(env, {
    to: TO,
    replyTo: email,
    subject: `Data valuation from ${name} at ${company}`,
    html: `<div style="font-family:Georgia,serif;line-height:1.5;color:#121212;max-width:640px"><h1 style="font-size:22px;font-weight:500">New data valuation</h1><p style="white-space:pre-wrap">${esc(summary)}</p></div>`,
  });

  if (!internal.ok) {
    return json({ ok: false, error: "Could not send your valuation. Please try again." }, 502);
  }

  const first = name.split(" ")[0];
  await sendResend(env, {
    to: email,
    subject: `Your TalentBridge data range: ${range}`,
    html: `<div style="font-family:Georgia,serif;line-height:1.5;color:#121212;max-width:560px"><p>Hi ${esc(first)},</p><p>Your estimated range is <strong>${esc(range)}</strong> (${esc(tier)}). This is indicative only. A specialist will follow up within two days.</p><p>Dan<br>Founder, TalentBridge</p></div>`,
  });

  return json({ ok: true, refLink });
}

function esc(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
