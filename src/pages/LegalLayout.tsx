import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export function LegalLayout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="bg-paper font-sans text-ink">
      <Header />
      <main id="main" className="mx-auto max-w-[720px] px-5 py-12 md:px-8 md:py-16">
        <p className="font-mono text-[13px] text-muted">
          <Link to="/" className="hover:text-ink hover:underline">
            Home
          </Link>
          <span aria-hidden className="mx-2">
            /
          </span>
          {title}
        </p>
        <h1 className="mt-4 font-serif text-[36px] font-medium leading-[1.1] tracking-[-0.02em] md:text-[48px]">
          {title}
        </h1>
        <div className="mt-8 space-y-5 text-[16px] leading-[1.65] text-soft">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
