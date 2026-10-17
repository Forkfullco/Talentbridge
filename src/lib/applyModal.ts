import { useSyncExternalStore } from "react";

/** Tiny shared store so every Apply trigger opens the same pre-qualification form. */
let open = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function openApplyForm() {
  open = true;
  emit();
}

export function closeApplyForm() {
  open = false;
  emit();
}

export function useApplyFormOpen() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => open,
    () => false,
  );
}
