import { useEffect } from "react";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { Ticker } from "../components/Ticker";
import { Qualify } from "../components/Qualify";
import { Tasks } from "../components/Tasks";
import { Steps } from "../components/Steps";
import { Faq } from "../components/Faq";
import { FinalCta } from "../components/FinalCta";
import { Footer } from "../components/Footer";
import { StickyApply } from "../components/StickyApply";

export function HomePage() {
  useEffect(() => {
    document.title = "Talent Bridge | The Bridge To Remote Work";
  }, []);

  return (
    <div className="bg-paper font-sans text-ink">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-lime focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Ticker />
        <Qualify />
        <Tasks />
        <Steps />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <StickyApply />
    </div>
  );
}
