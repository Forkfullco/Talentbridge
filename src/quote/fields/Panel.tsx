import type { ReactNode } from "react";

type PanelProps = { title: string; children?: ReactNode };

export function Panel({ title, children }: PanelProps) {
  return (
    <div className="mb-4 rounded-2xl border border-qz-line bg-qz-card px-6 py-5">
      <h3 className="mb-3.5 font-mono text-[13px] uppercase tracking-[0.06em] text-qz-muted">{title}</h3>
      {children}
    </div>
  );
}
