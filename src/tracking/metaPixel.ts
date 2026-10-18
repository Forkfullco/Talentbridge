/**
 * META PIXEL + GA helpers
 * ------------------------------------------------------------------
 * Base snippets live in index.html <head> (gtag + fbq init / PageView /
 * noscript) so they load before React. This module fires Lead events on
 * successful apply-form submit via trackLead() (not on the Apply click).
 */
export const PIXEL_ID = "1685542169905756";
export const GA_MEASUREMENT_ID = "G-CW1HP8BX8B";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
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

/** Fire Meta Lead + GA generate_lead. Call after a successful form save. */
export function trackLead() {
  try {
    window.fbq?.("track", "Lead");
  } catch {
    /* never block the outbound click */
  }
  try {
    window.gtag?.("event", "generate_lead", { send_to: GA_MEASUREMENT_ID });
  } catch {
    /* never block the outbound click */
  }
}
