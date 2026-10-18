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

  const name = String(body.name || "").trim().slice(0, 120);
  const email = String(body.email || "").trim().toLowerCase().slice(0, 200);
  const message = String(body.message || "").trim().slice(0, 5000);

  if (!name) return json({ ok: false, error: "Enter your name." }, 400);
  if (!validEmail(email)) return json({ ok: false, error: "Enter a valid email address." }, 400);
  if (!message) return json({ ok: false, error: "Enter a message." }, 400);

  const result = await sendResend(env, {
    to: TO,
    replyTo: email,
    subject: `TalentBridge contact from ${name}`,
    html: `<div style="font-family:Georgia,serif;line-height:1.5;color:#121212;max-width:560px"><h1 style="font-size:22px;font-weight:500">New contact message</h1><p><strong>Name:</strong> ${esc(name)}<br><strong>Email:</strong> ${esc(email)}</p><p style="white-space:pre-wrap">${esc(message)}</p></div>`,
  });

  if (!result.ok) {
    return json({ ok: false, error: "Could not send your message. Please try again." }, 502);
  }
  return json({ ok: true });
}

function esc(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
