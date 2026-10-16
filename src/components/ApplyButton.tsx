import { ArrowUpRight } from "lucide-react";
import { APPLY_URL } from "../lib/apply";
import { trackLead } from "../tracking/metaPixel";

/**
 * Every Apply link. Fires fbq('track','Lead') synchronously in the click
 * handler, then the browser opens the link in a new tab.
 */
export function ApplyButton({ label = "Apply now", size = "lg", className = "" }: { label?: string; size?: "md" | "lg"; className?: string }) {
  return (
    <a
      href={APPLY_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={trackLead}
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-lime font-semibold text-ink transition-[background-color,transform] duration-150 ease-out hover:bg-lime-hover active:translate-y-px ${
        size === "lg" ? "min-h-[64px] px-9 text-[19px]" : "min-h-[48px] px-6 text-[17px]"
      } ${className}`}
    >
      {label}
      <ArrowUpRight size={size === "lg" ? 22 : 18} strokeWidth={2.5} aria-hidden />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}
