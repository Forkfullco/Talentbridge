export type YN = "yes" | "no" | "";

export type ApplyOutcome = "not_qualified" | "qualified_desktop" | "qualified_mobile";

/** Bedside is preferred and still stored. Only a missing US RN license disqualifies. */
export function isQualified(licensed: YN, _bedside: YN) {
  return licensed === "yes";
}

export function applyOutcome(licensed: YN, bedside: YN, desktop: YN): ApplyOutcome {
  if (!isQualified(licensed, bedside)) return "not_qualified";
  if (desktop === "no") return "qualified_mobile";
  return "qualified_desktop";
}

export function statusForOutcome(outcome: ApplyOutcome) {
  return outcome === "not_qualified" ? "Not qualified" : "New";
}
