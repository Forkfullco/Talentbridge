import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { LegalLayout } from "./LegalLayout";

type Status = "loading" | "ok" | "already" | "error";

export function AppliedPage() {
  const [params] = useSearchParams();
  const token = params.get("t") || params.get("token") || "";
  const preOk = params.get("ok") === "1";
  const [status, setStatus] = useState<Status>(() => (token ? "loading" : preOk ? "ok" : "error"));

  useEffect(() => {
    document.title = "Application status | Talent Bridge";
  }, []);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    fetch("/api/applied", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        const data = (await res.json().catch(() => null)) as { ok?: boolean; already?: boolean } | null;
        if (cancelled) return;
        if (!res.ok || !data?.ok) setStatus("error");
        else setStatus(data.already ? "already" : "ok");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [token, preOk]);

  return (
    <LegalLayout title="I’ve applied">
      {status === "loading" && <p>Updating your status…</p>}
      {status === "ok" && (
        <>
          <p>You’re marked as applied. We won’t send more reminder emails about this role.</p>
          <p>
            <Link to="/" className="font-medium text-ink underline underline-offset-4">
              Back to TalentBridge
            </Link>
          </p>
        </>
      )}
      {status === "already" && (
        <>
          <p>This application was already marked applied. No further reminders will go out.</p>
          <p>
            <Link to="/" className="font-medium text-ink underline underline-offset-4">
              Back to TalentBridge
            </Link>
          </p>
        </>
      )}
      {status === "error" && (
        <>
          <p>We couldn’t match that confirmation link. If you already applied on micro1, you can ignore the reminders, or reply to the email and we’ll stop them.</p>
          <p>
            <Link to="/" className="font-medium text-ink underline underline-offset-4">
              Back to TalentBridge
            </Link>
          </p>
        </>
      )}
    </LegalLayout>
  );
}
