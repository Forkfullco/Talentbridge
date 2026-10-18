const APPLY_URL =
  "https://jobs.micro1.ai/post/c25ab1f0-c287-4061-b30b-e13c32372fc2?referralCode=1aaa1da8-e2b6-442d-b5de-a358fbc75c09&utm_source=referral&utm_medium=share&utm_campaign=job_referral";
const FROM = "TalentBridge <talent@talentbridgeremote.com>";
const REPLY_TO = "officialleadsurge@gmail.com";

/** Hours after the apply timestamp. Stage 1 is sent immediately by /api/apply. */
export const DRIP_HOURS = { 1: 0, 2: 4, 3: 12, 4: 24, 5: 48, 6: 72 };
const LAST_STAGE = 6;

export async function sendResend(env, { to, subject, html, replyTo }) {
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
      reply_to: replyTo || REPLY_TO,
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
      subject: "Thanks for checking in with TalentBridge",
      html: shell(
        "Thanks for checking in",
        `<p>Hi ${esc(name)},</p><p>This particular remote RN role is for nurses with an active US license and recent inpatient or bedside experience.</p><p>We’ll email you when another remote role looks like a better match.</p>`,
      ),
    };
  }
  if (stage === 1) {
    return {
      subject: "Your TalentBridge application link + how to prep",
      html: shell(
        "Your application link",
        `<p>Hi ${esc(name)},</p><p>You’re a fit for this remote RN AI-training role. Next is the application, then an AI interview.</p>${cta(APPLY_URL, "Start your application")}<p><strong>How to prep</strong></p><ol><li>Create an account using <strong>this same email</strong>.</li><li>Set aside up to about 50 minutes for the AI interview.</li><li>Use Chrome on a laptop or desktop with a working camera and microphone, in a quiet space.</li></ol><p><strong>Interview tips:</strong> speak clearly, use concrete examples from inpatient or bedside work, and take a breath before you answer.</p>${appliedLine(applied)}`,
      ),
    };
  }
  if (stage === 2) {
    return {
      subject: "Did you get a chance to apply?",
      html: shell(
        "Still open — your link",
        `<p>Hi ${esc(name)},</p><p>Your application is still waiting. Starting it takes about 15–20 minutes. You can do the AI interview after that, when you have a quiet hour.</p>${cta(APPLY_URL, "Open your application")}${appliedLine(applied)}`,
      ),
    };
  }
  if (stage === 3) {
    return {
      subject: "Why nurses take this remote role",
      html: shell(
        "Remote work that uses your clinical judgment",
        `<p>Hi ${esc(name)},</p><p>Matched work pays $60–70 an hour, from home, on hours you choose. You use the inpatient and bedside judgment you already have to help train medical AI. TalentBridge never asks you for money to apply.</p><p>The next step is still the application, then an AI interview of about 50 minutes. Use Chrome on a laptop or desktop with a camera and mic.</p>${cta(APPLY_URL, "Start your application")}${appliedLine(applied)}`,
      ),
    };
  }
  if (stage === 4) {
    return {
      subject: "Use this same email on the application",
      html: shell(
        "One account, this email",
        `<p>Hi ${esc(name)},</p><p>Create the account with <strong>this same email</strong> so the application lines up with the note you just sent us. The form is still about 15–20 minutes.</p><p>If you already finished, use I’ve applied below and we’ll stop these reminders.</p>${cta(APPLY_URL, "Open your application")}${appliedLine(applied)}`,
      ),
    };
  }
  if (stage === 5) {
    return {
      subject: "The remote RN role is still open",
      html: shell(
        "Still time to finish",
        `<p>Hi ${esc(name)},</p><p>The role is still open, and your link still works. Nurses who finish the application and the AI interview are the ones who get matched. It will not stay open forever — if you want the remote $60–70/hr work, start today.</p>${cta(APPLY_URL, "Apply now")}${appliedLine(applied)}`,
      ),
    };
  }
  return {
    subject: "Last reminder: finish your application",
    html: shell(
      "Last reminder",
      `<p>Hi ${esc(name)},</p><p>This is the last note from us about this role. Your application link still works. Plan about 15–20 minutes to start, then up to about 50 minutes for the AI interview.</p>${cta(APPLY_URL, "Apply now")}<p><strong>Quick FAQ</strong></p><ul><li><strong>Do I need a new account?</strong> Yes — create an account with the email you used on TalentBridge.</li><li><strong>How long is the interview?</strong> Plan for up to about 50 minutes.</li><li><strong>Phone or laptop?</strong> Laptop or desktop, Chrome, camera, and mic.</li></ul>${appliedLine(applied)}`,
    ),
  };
}

export async function sendLeadEmail(env, stage, lead) {
  const site = env.SITE_URL || "https://talentbridge-4pb.pages.dev";
  const msg = messageFor(stage, { firstName: lead.first_name, token: lead.applied_token, site });
  return sendResend(env, { to: lead.email, subject: msg.subject, html: msg.html });
}

/** Hourly drip from the apply timestamp: 0h, 4h, 12h, 24h, 48h, 72h. Stops when status is Applied. */
export async function processReminders(env) {
  if (!env.DB || !env.RESEND_API_KEY) return { ok: false, skipped: true };
  const nowMs = Date.now();
  const { results } = await env.DB.prepare(
    `SELECT id, timestamp, first_name, email, applied_token, email_status
     FROM leads
     WHERE status = 'New' AND (stopped IS NULL OR stopped = '')
       AND email_status IN ('needs_provider', 'send_failed', 'sent_1', 'sent_2', 'sent_3', 'sent_4', 'sent_5')
     ORDER BY id ASC
     LIMIT 50`,
  ).all();
  let sent = 0;
  for (const row of results || []) {
    const stage = dueStage(row, nowMs);
    if (!stage) continue;
    const nextStatus = `sent_${stage}`;
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

function dueStage(row, nowMs) {
  const sent = sentCount(row.email_status);
  if (sent < 0 || sent >= LAST_STAGE) return 0;
  const stage = sent + 1;
  const start = Date.parse(row.timestamp);
  if (!Number.isFinite(start)) return 0;
  const due = start + DRIP_HOURS[stage] * 60 * 60 * 1000;
  return due <= nowMs ? stage : 0;
}

function sentCount(status) {
  if (status === "needs_provider" || status === "send_failed") return 0;
  const match = /^sent_(\d+)$/.exec(status || "");
  return match ? Number(match[1]) : -1;
}

function shell(title, inner) {
  return `<div style="font-family:Georgia,serif;line-height:1.5;color:#121212;max-width:560px"><h1 style="font-size:22px;font-weight:500">${esc(title)}</h1>${inner}<p style="margin-top:28px;font-size:13px;color:#666">TalentBridge · remote RN roles<br>You’re receiving this because you asked us to email you about this opportunity.</p></div>`;
}

function cta(href, label) {
  return `<p style="margin:24px 0"><a href="${esc(href)}" style="background:#d6f35b;color:#121212;text-decoration:none;padding:12px 20px;border-radius:999px;font-weight:600;display:inline-block">${esc(label)}</a></p>`;
}

function appliedLine(href) {
  return `<p style="margin-top:20px;font-size:14px">Already submitted your application? <a href="${esc(href)}">I’ve applied</a> — we’ll stop these reminders.</p>`;
}

function esc(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
