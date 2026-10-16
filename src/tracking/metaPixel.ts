/**
 * META PIXEL — BASE CODE PLACEHOLDER
 * ------------------------------------------------------------------
 * This module runs before the app mounts and writes into <head>.
 * To go live, replace PIXEL_ID below with your Meta Pixel ID. The
 * official base snippet is reproduced in `injectBaseCode()`.
 *
 * Until a real ID is set, a no-op `fbq` stub is installed so every
 * `fbq('track', 'Lead')` call is safe (and logged to the console).
 */
export const PIXEL_ID = "YOUR_PIXEL_ID";

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & { queue?: unknown[]; loaded?: boolean };
    _fbq?: unknown;
  }
}

function injectBaseCode() {
  // <!-- Meta Pixel Code -->
  const s = document.createElement("script");
  s.id = "meta-pixel-base";
  s.text = `
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${PIXEL_ID}');
fbq('track', 'PageView');`;
  document.head.appendChild(s);
  // <noscript><img height="1" width="1" style="display:none"
  //   src="https://www.facebook.com/tr?id=YOUR_PIXEL_ID&ev=PageView&noscript=1"/></noscript>
  // <!-- End Meta Pixel Code -->
}

function installStub() {
  document.head.appendChild(document.createComment(" Meta Pixel base code placeholder — set PIXEL_ID in tracking/metaPixel.ts "));
  const stub = (...args: unknown[]) => console.info("[fbq placeholder]", ...args);
  window.fbq = stub;
}

if (typeof window !== "undefined" && !window.fbq) {
  if (PIXEL_ID === "YOUR_PIXEL_ID") installStub();
  else injectBaseCode();
}

/** Fire the Lead event. Call synchronously in the click handler, before navigation. */
export function trackLead() {
  try {
    window.fbq?.("track", "Lead");
  } catch {
    /* never block the outbound click */
  }
}
