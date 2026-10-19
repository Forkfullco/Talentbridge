import { useEffect } from "react";
import { DataHeader } from "./DataHeader";
import { DataHero } from "./DataHero";
import { WhyData } from "./WhyData";
import { DataTypes } from "./DataTypes";
import { DataSteps } from "./DataSteps";
import { DataCta } from "./DataCta";
import { Ticker } from "../components/Ticker";
import { Footer } from "../components/Footer";

/** Second landing page: for businesses licensing their operational data to AI labs. */
export function DataPage() {
  useEffect(() => {
    document.title = "Business data | Talent Bridge";
  }, []);

  return (
    <div className="bg-paper font-sans text-ink">
      <DataHeader />
      <main>
        <DataHero />
        <Ticker phrases={["Earn $1M+", "Read-only access", "De-identified first", "You approve every deal"]} />
        <WhyData />
        <DataTypes />
        <DataSteps />
        <DataCta />
      </main>
      <Footer variant="data" />
    </div>
  );
}
