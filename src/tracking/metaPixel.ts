/**
 * META PIXEL + GA helpers
 * ------------------------------------------------------------------
 * Base snippets live in index.html <head> (gtag + fbq init / PageView /
 * noscript) so they load before React. trackLead() fires only after a
 * successful apply-form save, never on the Apply click.
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

/** Official stub so a Lead can queue if the head snippet has not run yet. */
function ensurePixel() {
  if (typeof window.fbq !== "function") {
    const n: NonNullable<Window["fbq"]> = function fbqStub(this: NonNullable<Window["fbq"]>) {
      if (n.callMethod) n.callMethod.apply(n, arguments as unknown as unknown[]);
      else n.queue?.push(arguments);
    };
    if (!window._fbq) window._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];
    window.fbq = n;
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    const first = document.getElementsByTagName("script")[0];
    first?.parentNode?.insertBefore(script, first);
  }
  window.fbq("init", PIXEL_ID);
  return window.fbq;
}

/** Fire Meta Lead + GA generate_lead. Call after a successful form save. */
export function trackLead() {
  try {
    ensurePixel()("track", "Lead");
  } catch {
    /* never block the success screen */
  }
  try {
    window.gtag?.("event", "generate_lead", { send_to: GA_MEASUREMENT_ID });
  } catch {
    /* never block the success screen */
  }
}
