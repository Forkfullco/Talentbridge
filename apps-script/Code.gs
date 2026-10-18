/**
 * TalentBridge apply capture + Gmail sequence.
 *
 * Bound to spreadsheet: TalentBridge Apply Leads
 * https://docs.google.com/spreadsheets/d/1hy0KYNqXzk3nwBDJq5YsuEomNCQb4bCdPNGoujA_Mec/edit
 *
 * One-time setup (in the Apps Script editor):
 *  1. Project Settings → Script properties:
 *       APPLY_SECRET   = (same value as the Cloudflare APPLY_SECRET)
 *       SITE_URL       = https://talentbridge-4pb.pages.dev
 *       APPLY_URL      = (Micro1 job URL)
 *       FROM_NAME      = TalentBridge
 *  2. Run setup() once and approve Gmail + Sheets access.
 *  3. Deploy → New deployment → Web app
 *       Execute as: Me
 *       Who has access: Anyone
 *  4. Put the web app URL in Cloudflare secret APPS_SCRIPT_URL.
 */

var SHEET_NAME = "TalentBridge Apply Leads";
var HEADERS = [
  "timestamp",
  "firstName",
  "email",
  "phone",
  "licensed",
  "bedside",
  "state",
  "desktop",
  "consent",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "status",
  "appliedToken",
  "email1Sent",
  "email2Sent",
  "email3Sent",
  "stopped",
];

var COL = {
  timestamp: 1,
  firstName: 2,
  email: 3,
  phone: 4,
  licensed: 5,
  bedside: 6,
  state: 7,
  desktop: 8,
  consent: 9,
  utm_source: 10,
  utm_medium: 11,
  utm_campaign: 12,
  utm_content: 13,
  utm_term: 14,
  status: 15,
  appliedToken: 16,
  email1Sent: 17,
  email2Sent: 18,
  email3Sent: 19,
  stopped: 20,
};

function setup() {
  var sheet = getSheet_();
  ensureHeaders_(sheet);
  var existing = ScriptApp.getProjectTriggers();
  for (var i = 0; i < existing.length; i++) {
    ScriptApp.deleteTrigger(existing[i]);
  }
  ScriptApp.newTrigger("processReminders").timeBased().everyHours(1).create();
}

function doGet(e) {
  var token = (e && e.parameter && (e.parameter.t || e.parameter.token)) || "";
  var result = markApplied_(token);
  var site = prop_("SITE_URL", "https://talentbridge-4pb.pages.dev");
  var dest = site.replace(/\/$/, "") + "/applied?ok=" + (result.ok ? "1" : "0");
  return HtmlService.createHtmlOutput(
    '<!doctype html><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=' +
      dest +
      '"><p>Updating your application status… <a href="' +
      dest +
      '">Continue</a></p>'
  );
}

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    if (!body || body.secret !== prop_("APPLY_SECRET")) {
      return json_({ ok: false, error: "unauthorized" }, 401);
    }
    if (body.action === "apply") return json_(handleApply_(body));
    if (body.action === "applied") return json_(markApplied_(body.token));
    if (body.action === "tick") return json_(processReminders());
    return json_({ ok: false, error: "unknown action" });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function handleApply_(body) {
  var sheet = getSheet_();
  ensureHeaders_(sheet);
  var email = String(body.email || "").trim().toLowerCase();
  var firstName = String(body.firstName || "").trim();
  var licensed = body.licensed === "yes" ? "yes" : "no";
  var bedside = body.bedside === "yes" ? "yes" : "no";
  var desktop = body.desktop === "yes" ? "yes" : body.desktop === "no" ? "no" : "";
  var qualified = licensed === "yes" && bedside === "yes";
  var status = qualified ? "New" : "Not qualified";
  var token = randomToken_();
  var now = new Date();
  var utm = body.utm || {};
  var row = [
    now.toISOString(),
    firstName,
    email,
    String(body.phone || "").trim(),
    licensed,
    bedside,
    String(body.state || "").trim(),
    desktop,
    body.consent ? "yes" : "no",
    String(utm.utm_source || "").trim(),
    String(utm.utm_medium || "").trim(),
    String(utm.utm_campaign || "").trim(),
    String(utm.utm_content || "").trim(),
    String(utm.utm_term || "").trim(),
    status,
    token,
    "",
    "",
    "",
    "",
  ];
  sheet.appendRow(row);
  var emailSent = false;
  if (qualified) {
    emailSent = sendStage_(1, firstName, email, token);
    if (emailSent) {
      sheet.getRange(sheet.getLastRow(), COL.email1Sent).setValue(now.toISOString());
    }
  }
  return { ok: true, outcome: qualified ? (desktop === "no" ? "qualified_mobile" : "qualified_desktop") : "not_qualified", emailSent: emailSent };
}

function markApplied_(token) {
  token = String(token || "").trim();
  if (!token) return { ok: false, error: "missing token" };
  var sheet = getSheet_();
  var values = sheet.getDataRange().getValues();
  for (var i = 1; i < values.length; i++) {
    if (String(values[i][COL.appliedToken - 1]) === token) {
      if (String(values[i][COL.status - 1]) === "Applied" || String(values[i][COL.stopped - 1]) === "yes") {
        return { ok: true, already: true };
      }
      sheet.getRange(i + 1, COL.status).setValue("Applied");
      sheet.getRange(i + 1, COL.stopped).setValue("yes");
      return { ok: true, already: false };
    }
  }
  return { ok: false, error: "unknown token" };
}

function processReminders() {
  var sheet = getSheet_();
  var values = sheet.getDataRange().getValues();
  var now = new Date();
  var sent2 = 0;
  var sent3 = 0;
  for (var i = 1; i < values.length; i++) {
    var row = values[i];
    if (String(row[COL.status - 1]) !== "New") continue;
    if (String(row[COL.stopped - 1]) === "yes") continue;
    var ts = new Date(row[COL.timestamp - 1]);
    if (isNaN(ts.getTime())) continue;
    var ageMs = now.getTime() - ts.getTime();
    var firstName = String(row[COL.firstName - 1] || "");
    var email = String(row[COL.email - 1] || "");
    var token = String(row[COL.appliedToken - 1] || "");
    if (!email || !token) continue;
    if (!row[COL.email2Sent - 1] && ageMs >= 24 * 60 * 60 * 1000) {
      if (sendStage_(2, firstName, email, token)) {
        sheet.getRange(i + 1, COL.email2Sent).setValue(now.toISOString());
        sent2++;
      }
    }
    if (!row[COL.email3Sent - 1] && ageMs >= 3 * 24 * 60 * 60 * 1000) {
      if (sendStage_(3, firstName, email, token)) {
        sheet.getRange(i + 1, COL.email3Sent).setValue(now.toISOString());
        sent3++;
      }
    }
  }
  return { ok: true, sent2: sent2, sent3: sent3 };
}

function sendStage_(stage, firstName, email, token) {
  var site = prop_("SITE_URL", "https://talentbridge-4pb.pages.dev").replace(/\/$/, "");
  var applyUrl = prop_(
    "APPLY_URL",
    "https://jobs.micro1.ai/post/c25ab1f0-c287-4061-b30b-e13c32372fc2?referralCode=1aaa1da8-e2b6-442d-b5de-a358fbc75c09&utm_source=referral&utm_medium=share&utm_campaign=job_referral"
  );
  var appliedUrl = site + "/applied?t=" + encodeURIComponent(token);
  var name = firstName || "there";
  var fromName = prop_("FROM_NAME", "TalentBridge");
  var subject;
  var html;
  if (stage === 1) {
    subject = "Your TalentBridge application link + how to prep";
    html = emailShell_(
      "Your application link",
      "<p>Hi " +
        esc_(name) +
        ",</p><p>Thanks for checking in with TalentBridge. You’re a fit for this remote RN AI-training role. Next is the application, then an AI interview.</p>" +
        cta_(applyUrl, "Start your application") +
        "<p><strong>How to prep</strong></p><ol>" +
        "<li>Create an account using <strong>this same email</strong>.</li>" +
        "<li>Set aside up to about 50 minutes for the AI interview.</li>" +
        "<li>Use Chrome on a laptop or desktop with a working camera and microphone, in a quiet space.</li>" +
        "</ol><p><strong>Interview tips:</strong> speak clearly, use concrete examples from inpatient/bedside work, and don’t rush — you can take a breath before answering.</p>" +
        appliedLine_(appliedUrl)
    );
  } else if (stage === 2) {
    subject = "Did you get a chance to apply?";
    html = emailShell_(
      "Still open — your link",
      "<p>Hi " +
        esc_(name) +
        ",</p><p>Just a note that your application is still waiting. It takes about 15–20 minutes to start, plus the AI interview when you’re ready.</p>" +
        cta_(applyUrl, "Open your application") +
        appliedLine_(appliedUrl)
    );
  } else {
    subject = "Last reminder: the remote RN role is still open";
    html = emailShell_(
      "Last reminder",
      "<p>Hi " +
        esc_(name) +
        ",</p><p>This is the last note from us about this role. It’s still open, and your application link still works.</p>" +
        cta_(applyUrl, "Apply now") +
        "<p><strong>Quick FAQ</strong></p><ul>" +
        "<li><strong>Do I need a new account?</strong> Yes — create an account with the email you used on TalentBridge.</li>" +
        "<li><strong>How long is the interview?</strong> Plan for up to about 50 minutes.</li>" +
        "<li><strong>Phone or laptop?</strong> Laptop/desktop with Chrome, camera, and mic.</li>" +
        "</ul>" +
        appliedLine_(appliedUrl)
    );
  }
  try {
    GmailApp.sendEmail(email, subject, strip_(html), {
      htmlBody: html,
      name: fromName,
    });
    return true;
  } catch (err) {
    return false;
  }
}

function emailShell_(title, inner) {
  return (
    '<div style="font-family:Georgia,serif;line-height:1.5;color:#121212;max-width:560px">' +
    "<h1 style=\"font-size:22px;font-weight:500\">" +
    esc_(title) +
    "</h1>" +
    inner +
    '<p style="margin-top:28px;font-size:13px;color:#666">TalentBridge · remote RN roles<br>You’re receiving this because you asked us to email you about this opportunity.</p></div>'
  );
}

function cta_(href, label) {
  return (
    '<p style="margin:24px 0"><a href="' +
    esc_(href) +
    '" style="background:#d6f35b;color:#121212;text-decoration:none;padding:12px 20px;border-radius:999px;font-weight:600;display:inline-block">' +
    esc_(label) +
    "</a></p>"
  );
}

function appliedLine_(href) {
  return (
    '<p style="margin-top:20px;font-size:14px">Already submitted your application? <a href="' +
    esc_(href) +
    '">I’ve applied</a> — we’ll stop these reminders.</p>'
  );
}

function getSheet_() {
  var ss = SpreadsheetApp.getActive() || SpreadsheetApp.openById("1hy0KYNqXzk3nwBDJq5YsuEomNCQb4bCdPNGoujA_Mec");
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
  if (sheet.getName() !== SHEET_NAME) {
    try {
      sheet.setName(SHEET_NAME);
    } catch (e) {
      /* keep existing name */
    }
  }
  return sheet;
}

function ensureHeaders_(sheet) {
  var existing = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  var empty = !existing[0];
  if (empty) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
}

function randomToken_() {
  var bytes = Utilities.getUuid().replace(/-/g, "") + Utilities.getUuid().replace(/-/g, "");
  return bytes.slice(0, 32);
}

function prop_(key, fallback) {
  var v = PropertiesService.getScriptProperties().getProperty(key);
  return v || fallback || "";
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function esc_(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function strip_(html) {
  return String(html || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
