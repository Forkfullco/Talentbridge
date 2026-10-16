import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { ApplyButton } from "./ApplyButton";
import { hasApplied, hasSeenExit, markExitSeen } from "../lib/sessionFlags";

function isMobileViewport() {
  return typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;
}

/** Exit-intent modal: desktop mouse-leave; mobile scroll+dwell. Once per session. */
export function ExitIntent() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const armed = useRef(false);
  const shown = useRef(false);

  useEffect(() => {
    if (hasSeenExit() || hasApplied()) return;

    const show = () => {
      if (shown.current || hasSeenExit() || hasApplied()) return;
      shown.current = true;
      markExitSeen();
      setOpen(true);
    };

    // Brief delay so we don't catch the first mouse movement into the page
    const armTimer = window.setTimeout(() => {
      armed.current = true;
    }, 2500);

    const onMouseOut = (e: MouseEvent) => {
      if (!armed.current || isMobileViewport()) return;
      if (e.relatedTarget || (e as MouseEvent & { toElement?: EventTarget }).toElement) return;
      if (e.clientY > 8) return;
      show();
    };

    // Mobile: ~50% scroll + short dwell after that threshold
    let scrolledHalf = false;
    let dwellTimer: number | undefined;
    const onScroll = () => {
      if (!armed.current || !isMobileViewport()) return;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      if (window.scrollY / max >= 0.5) {
        scrolledHalf = true;
        if (dwellTimer === undefined) {
          dwellTimer = window.setTimeout(() => {
            if (scrolledHalf) show();
          }, 2800);
        }
      }
    };

    // Soft fallback: user returns to tab after having scrolled some
    const onVisibility = () => {
      if (document.visibilityState !== "visible" || !armed.current) return;
      if (!isMobileViewport()) return;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      if (max > 0 && window.scrollY / max >= 0.35) show();
    };

    document.addEventListener("mouseout", onMouseOut);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.clearTimeout(armTimer);
      if (dwellTimer !== undefined) window.clearTimeout(dwellTimer);
      document.removeEventListener("mouseout", onMouseOut);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="presentation"
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink/55 p-4 sm:items-center"
          initial={reduce ? { opacity: 0 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0.01 : 0.2 }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            initial={reduce ? false : { y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { y: 12, opacity: 0 }}
            transition={{ duration: reduce ? 0.01 : 0.22, ease: [0.23, 1, 0.32, 1] }}
            className="relative w-full max-w-[440px] rounded-[24px] bg-paper px-6 pb-7 pt-8 text-ink shadow-none outline-none md:px-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              ref={closeRef}
              type="button"
              aria-label="Close"
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full text-muted transition-colors hover:bg-paper-2 hover:text-ink"
            >
              <X size={20} aria-hidden />
            </button>

            <p className="font-mono text-[12px] text-muted">Before you go</p>
            <h2 id={titleId} className="mt-2 max-w-[20ch] font-serif text-[28px] font-medium leading-[1.15] tracking-[-0.02em] md:text-[32px]">
              Still deciding? Remote RN work at{" "}
              <span className="bg-lime px-1">$60–70/hr</span>
            </h2>
            <p className="mt-3 text-[16px] leading-[1.5] text-soft">
              Application takes about 15–20 minutes. Open the listing and apply when you’re ready.
            </p>
            <ApplyButton label="Apply now" className="mt-6 w-full" />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-3 w-full py-2 text-center text-[14px] font-medium text-muted underline-offset-4 hover:text-ink hover:underline"
            >
              No thanks
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
