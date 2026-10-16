import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ApplyButton } from "./ApplyButton";

/** Mobile-only bottom bar that appears once the hero has scrolled out of view. */
export function StickyApply() {
  const [show, setShow] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) return;
    const io = new IntersectionObserver(([e]) => setShow(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={reduce ? { opacity: 0 } : { y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduce ? { opacity: 0 } : { y: 24, opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
          className="fixed inset-x-0 bottom-0 z-40 bg-ink px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 text-paper md:hidden"
        >
          <div className="flex items-center gap-3">
            <p className="flex-1 text-[14px] leading-tight text-paper/75">
              <span className="block font-semibold text-paper">RN · AI Training</span>
              $60–70/hr · remote
            </p>
            <ApplyButton label="Apply" size="md" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
