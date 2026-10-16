const APPLY_KEY = "tb_applied";
const EXIT_KEY = "tb_exit_seen";

export function markApplied() {
  try {
    sessionStorage.setItem(APPLY_KEY, "1");
  } catch {
    /* private mode */
  }
}

export function hasApplied() {
  try {
    return sessionStorage.getItem(APPLY_KEY) === "1";
  } catch {
    return false;
  }
}

export function markExitSeen() {
  try {
    sessionStorage.setItem(EXIT_KEY, "1");
  } catch {
    /* private mode */
  }
}

export function hasSeenExit() {
  try {
    return sessionStorage.getItem(EXIT_KEY) === "1";
  } catch {
    return false;
  }
}
