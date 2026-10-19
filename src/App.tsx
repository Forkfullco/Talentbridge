import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { PrivacyPage } from "./pages/PrivacyPage";
import { TermsPage } from "./pages/TermsPage";
import { AppliedPage } from "./pages/AppliedPage";
import { ContactPage } from "./pages/ContactPage";
import { DataPage } from "./data/DataPage";
import { QuotePage } from "./quote/QuotePage";
import { ExitIntent } from "./components/ExitIntent";
import { ApplyForm } from "./components/ApplyForm";

export function App() {
  const { pathname } = useLocation();
  const nurseApply = pathname === "/";
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/data" element={<DataPage />} />
        <Route path="/valuation" element={<QuotePage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/applied" element={<AppliedPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {nurseApply && <ExitIntent />}
      {nurseApply && <ApplyForm />}
    </>
  );
}
