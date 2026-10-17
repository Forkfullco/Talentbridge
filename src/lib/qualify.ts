export type YN = "yes" | "no" | "";

export type ApplyOutcome = "not_qualified" | "qualified_desktop" | "qualified_mobile";

export function isQualified(licensed: YN, bedside: YN) {
  return licensed === "yes" && bedside === "yes";
}

export function applyOutcome(licensed: YN, bedside: YN, desktop: YN): ApplyOutcome {
  if (!isQualified(licensed, bedside)) return "not_qualified";
  if (desktop === "no") return "qualified_mobile";
  return "qualified_desktop";
}

export function statusForOutcome(outcome: ApplyOutcome) {
  return outcome === "not_qualified" ? "Not qualified" : "New";
}
