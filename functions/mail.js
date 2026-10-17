const APPLY_URL =
  "https://jobs.micro1.ai/post/c25ab1f0-c287-4061-b30b-e13c32372fc2?referralCode=1aaa1da8-e2b6-442d-b5de-a358fbc75c09&utm_source=referral&utm_medium=share&utm_campaign=job_referral";
const FROM = "TalentBridge <talent@talentbridgeremote.com>";
const REPLY_TO = "officialleadsurge@gmail.com";

export async function sendResend(env, { to, subject, html }) {
  const key = env.RESEND_API_KEY;
  if (!key) return { ok: false, error: "missing_key" };
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM,
      to: [to],
      reply_to: REPLY_TO,
      subject,
      html,
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return { ok: false, error: data.message || data.error || `http_${res.status}` };
  return { ok: true, id: data.id };
}

export function messageFor(stage, { firstName, token, site }) {
  const name = firstName || "there";
  const base = String(site || "https://talentbridge-4pb.pages.dev").replace(/\/$/, "");
  const applied = `${base}/applied?t=${encodeURIComponent(token)}`;
  if (stage === "not_fit") {
    return {
      subject: "Other remote roles from TalentBridge",
      html: shell(
        "This role isn’t a fit",
        `<p>Hi ${esc(name)},</p><p>Thanks for checking in. This particular remote RN role needs an active US license and recent inpatient/bedside experience, so we won’t send you the application link.</p><p>We’ll email you when another remote role looks like a better match.</p>`,
      ),
    };
  }
  if (stage === 1) {
    return {
      subject: "Your TalentBridge application link + how to prep",
      html: shell(
        "Your application link",
        `<p>Hi ${esc(name)},</p><p>You’re a fit for this remote RN AI-training role. The application is hosted by our hiring partner, micro1.</p>${cta(APPLY_URL, "Start your micro1 application")}<p><strong>How to prep</strong></p><ol><li>Create a new micro1 account using <strong>this same email</strong>.</li><li>Set aside up to about 50 minutes for the AI interview.</li><li>Use Chrome on a laptop or desktop with a working camera and microphone, in a quiet space.</li></ol><p><strong>Interview tips:</strong> speak clearly, use concrete examples from inpatient or bedside work, and take a breath before you answer.</p>${appliedLine(applied)}`,
      ),
    };
  }
  if (stage === 2) {
    return {
      subject: "Did you get a chance to apply?",
      html: shell(
        "Still open — your link",
        `<p>Hi ${esc(name)},</p><p>Your TalentBridge / micro1 application is still waiting. It takes about 15–20 minutes to start, plus the AI interview when you’re ready.</p>${cta(APPLY_URL, "Open your application")}${appliedLine(applied)}`,
      ),
    };
  }
  return {
    subject: "Last reminder: the remote RN role is still open",
    html: shell(
      "Last reminder",
      `<p>Hi ${esc(name)},</p><p>This is the last note from us about this role. It’s still open, and your application link still works.</p>${cta(APPLY_URL, "Apply on micro1")}<p><strong>Quick FAQ</strong></p><ul><li><strong>Do I need a new account?</strong> Yes — create a micro1 account with the email you used on TalentBridge.</li><li><strong>How long is the interview?</strong> Plan for up to about 50 minutes.</li><li><strong>Phone or laptop?</strong> Laptop or desktop, Chrome, camera, and mic.</li></ul>${appliedLine(applied)}`,
    ),
  };
}

export async function sendLeadEmail(env, stage, lead) {
  const site = env.SITE_URL || "https://talentbridge-4pb.pages.dev";
  const msg = messageFor(stage, { firstName: lead.first_name, token: lead.applied_token, site });
  return sendResend(env, { to: lead.email, subject: msg.subject, html: msg.html });
}

/** Hourly drip: email 1 if still unsent, then +24h, then +3 days. Stops when status is Applied. */
export async function processReminders(env) {
  if (!env.DB || !env.RESEND_API_KEY) return { ok: false, skipped: true };
  const now = new Date().toISOString();
  const { results } = await env.DB.prepare(
    `SELECT id, first_name, email, applied_token, email_status, email1_due, email2_due, email3_due
     FROM leads
     WHERE status = 'New' AND (stopped IS NULL OR stopped = '')
       AND email_status IN ('needs_provider', 'send_failed', 'sent_1', 'sent_2')
     ORDER BY id ASC
     LIMIT 50`,
  ).all();
  let sent = 0;
  for (const row of results || []) {
    let stage = 0;
    let nextStatus = "";
    if ((row.email_status === "needs_provider" || row.email_status === "send_failed") && row.email1_due && row.email1_due <= now) {
      stage = 1;
      nextStatus = "sent_1";
    } else if (row.email_status === "sent_1" && row.email2_due && row.email2_due <= now) {
      stage = 2;
      nextStatus = "sent_2";
    } else if (row.email_status === "sent_2" && row.email3_due && row.email3_due <= now) {
      stage = 3;
      nextStatus = "sent_3";
    }
    if (!stage) continue;
    const result = await sendLeadEmail(env, stage, row);
    if (result.ok) {
      await env.DB.prepare("UPDATE leads SET email_status = ? WHERE id = ? AND status = 'New' AND (stopped IS NULL OR stopped = '')")
        .bind(nextStatus, row.id)
        .run();
      sent += 1;
    } else if (stage === 1) {
      await env.DB.prepare("UPDATE leads SET email_status = 'send_failed' WHERE id = ? AND status = 'New'")
        .bind(row.id)
        .run();
    }
  }
  return { ok: true, sent };
}

function shell(title, inner) {
  return `<div style="font-family:Georgia,serif;line-height:1.5;color:#121212;max-width:560px"><h1 style="font-size:22px;font-weight:500">${esc(title)}</h1>${inner}<p style="margin-top:28px;font-size:13px;color:#666">TalentBridge · remote RN roles<br>You’re receiving this because you asked us to email you about this opportunity.</p></div>`;
}

function cta(href, label) {
  return `<p style="margin:24px 0"><a href="${esc(href)}" style="background:#d6f35b;color:#121212;text-decoration:none;padding:12px 20px;border-radius:999px;font-weight:600;display:inline-block">${esc(label)}</a></p>`;
}

function appliedLine(href) {
  return `<p style="margin-top:20px;font-size:14px">Already submitted on micro1? <a href="${esc(href)}">I’ve applied</a> — we’ll stop these reminders.</p>`;
}

function esc(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
