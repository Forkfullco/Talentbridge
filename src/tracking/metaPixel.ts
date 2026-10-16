/**
 * META PIXEL
 * ------------------------------------------------------------------
 * Base snippet also lives in index.html <head> (fbq init + PageView +
 * noscript) so it loads before React. This module shares PIXEL_ID and
 * fires Lead on Apply clicks via trackLead().
 */
export const PIXEL_ID = "1685542169905756";

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & {
      callMethod?: (...args: unknown[]) => void;
      queue?: unknown[];
      loaded?: boolean;
      version?: string;
      push?: (...args: unknown[]) => void;
    };
    _fbq?: unknown;
  }
}

/** Fire the Lead event. Call synchronously in the click handler, before navigation. */
export function trackLead() {
  try {
    window.fbq?.("track", "Lead");
  } catch {
    /* never block the outbound click */
  }
}
