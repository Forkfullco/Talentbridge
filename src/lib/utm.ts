const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;
const STORAGE_KEY = "tb_utm";

export type UtmFields = Partial<Record<(typeof UTM_KEYS)[number], string>>;

function readStored(): UtmFields {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as UtmFields;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeStored(fields: UtmFields) {
  const json = JSON.stringify(fields);
  try {
    sessionStorage.setItem(STORAGE_KEY, json);
  } catch {
    /* private mode */
  }
  try {
    localStorage.setItem(STORAGE_KEY, json);
  } catch {
    /* private mode */
  }
}

/** Persist UTMs from the landing URL so the apply form can send them later. */
export function captureUtmsFromLocation() {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const next: UtmFields = { ...readStored() };
  let changed = false;
  for (const key of UTM_KEYS) {
    const value = params.get(key)?.trim();
    if (value) {
      next[key] = value;
      changed = true;
    }
  }
  if (changed) writeStored(next);
}

export function getUtms(): UtmFields {
  return readStored();
}
