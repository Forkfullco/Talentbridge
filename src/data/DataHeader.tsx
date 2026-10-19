import { Link } from "react-router-dom";
import { Logo } from "../components/Logo";

export function DataHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1080px] items-center justify-between px-5 md:px-8">
        <Link to="/" aria-label="TalentBridge home">
          <Logo />
        </Link>
        <Link
          to="/valuation"
          className="rounded-full bg-ink px-5 py-2.5 text-[15px] font-medium text-paper transition-colors duration-150 hover:bg-ink-2 active:translate-y-px"
        >
          Get a valuation
        </Link>
      </div>
    </header>
  );
}
