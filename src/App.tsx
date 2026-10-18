import { Navigate, Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { PrivacyPage } from "./pages/PrivacyPage";
import { TermsPage } from "./pages/TermsPage";
import { AppliedPage } from "./pages/AppliedPage";
import { ContactPage } from "./pages/ContactPage";
import { ExitIntent } from "./components/ExitIntent";
import { ApplyForm } from "./components/ApplyForm";

export function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/applied" element={<AppliedPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ExitIntent />
      <ApplyForm />
    </>
  );
}
