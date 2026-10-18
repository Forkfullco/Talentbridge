import { ArrowRight } from "lucide-react";
import { openApplyForm } from "../lib/applyModal";

/**
 * Every Apply trigger. Opens the short pre-qualification form; Lead
 * fires after a successful submit, not on this click.
 */
export function ApplyButton({
  label = "Apply now",
  size = "lg",
  className = "",
  onClick,
}: {
  label?: string;
  size?: "md" | "lg";
  className?: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        onClick?.();
        openApplyForm();
      }}
      aria-haspopup="dialog"
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-lime font-semibold text-ink transition-[background-color,transform] duration-150 ease-out hover:bg-lime-hover active:translate-y-px ${
        size === "lg" ? "min-h-[64px] px-9 text-[19px]" : "min-h-[48px] px-6 text-[17px]"
      } ${className}`}
    >
      {label}
      <ArrowRight size={size === "lg" ? 22 : 18} strokeWidth={2.5} aria-hidden />
    </button>
  );
}
