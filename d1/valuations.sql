CREATE TABLE IF NOT EXISTS valuations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp TEXT NOT NULL,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL DEFAULT '',
  range_text TEXT NOT NULL DEFAULT '',
  tier TEXT NOT NULL DEFAULT '',
  is_ref TEXT NOT NULL DEFAULT 'no',
  incoming_ref TEXT NOT NULL DEFAULT '',
  ref_code TEXT NOT NULL DEFAULT '',
  answers TEXT NOT NULL DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS valuations_email ON valuations (email);
