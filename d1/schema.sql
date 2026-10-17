CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp TEXT NOT NULL,
  first_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL DEFAULT '',
  licensed TEXT NOT NULL,
  bedside TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT '',
  desktop TEXT NOT NULL,
  consent TEXT NOT NULL,
  utm_source TEXT NOT NULL DEFAULT '',
  utm_medium TEXT NOT NULL DEFAULT '',
  utm_campaign TEXT NOT NULL DEFAULT '',
  utm_content TEXT NOT NULL DEFAULT '',
  utm_term TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL,
  applied_token TEXT NOT NULL UNIQUE,
  email_status TEXT NOT NULL DEFAULT '',
  email1_due TEXT NOT NULL DEFAULT '',
  email2_due TEXT NOT NULL DEFAULT '',
  email3_due TEXT NOT NULL DEFAULT '',
  stopped TEXT NOT NULL DEFAULT ''
);

CREATE INDEX IF NOT EXISTS leads_status ON leads (status);
