import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import type { IncomingMessage, ServerResponse } from "node:http";
import { defineConfig, type Plugin } from "vite";

type YN = "yes" | "no" | "";

function applyOutcome(licensed: YN, _bedside: YN, desktop: YN) {
  if (licensed !== "yes") return "not_qualified" as const;
  if (desktop === "no") return "qualified_mobile" as const;
  return "qualified_desktop" as const;
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (c) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function send(res: ServerResponse, status: number, data: unknown) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(data));
}

/** Local /api/apply + /api/applied so `vite` can preview the form without Wrangler. */
function applyDevApi(): Plugin {
  return {
    name: "apply-dev-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split("?")[0] || "";
        if (url !== "/api/apply" && url !== "/api/applied" && url !== "/api/contact" && url !== "/api/time-now") return next();
        if (req.method === "OPTIONS") {
          res.statusCode = 204;
          res.end();
          return;
        }

        const scriptUrl = process.env.APPS_SCRIPT_URL;
        const secret = process.env.APPLY_SECRET || "";

        if (url === "/api/contact" && req.method === "POST") {
          try {
            const body = JSON.parse(await readBody(req)) as { name?: string; email?: string; message?: string };
            const name = String(body.name || "").trim();
            const email = String(body.email || "").trim();
            const message = String(body.message || "").trim();
            if (!name) return send(res, 400, { ok: false, error: "Enter your name." });
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
              return send(res, 400, { ok: false, error: "Enter a valid email address." });
            }
            if (!message) return send(res, 400, { ok: false, error: "Enter a message." });
            send(res, 200, { ok: true });
          } catch {
            send(res, 400, { ok: false, error: "Invalid request" });
          }
          return;
        }

        if (url === "/api/apply" && req.method === "POST") {
          try {
            const body = JSON.parse(await readBody(req)) as {
              firstName?: string;
              email?: string;
              phone?: string;
              licensed?: YN;
              bedside?: YN;
              state?: string;
              desktop?: YN;
              consent?: boolean;
              utm?: Record<string, string>;
            };
            const outcome = applyOutcome(
              body.licensed === "yes" || body.licensed === "no" ? body.licensed : "",
              body.bedside === "yes" || body.bedside === "no" ? body.bedside : "",
              body.desktop === "yes" || body.desktop === "no" ? body.desktop : "",
            );
            if (scriptUrl) {
              const upstream = await fetch(scriptUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ secret, action: "apply", ...body, outcome }),
              });
              const data = (await upstream.json().catch(() => null)) as {
                ok?: boolean;
                outcome?: string;
                emailSent?: boolean;
              } | null;
              if (!upstream.ok || !data?.ok) {
                send(res, 502, { ok: false, error: "Could not save your application. Please try again." });
                return;
              }
              send(res, 200, { ok: true, outcome: data.outcome || outcome, emailSent: Boolean(data.emailSent) });
              return;
            }
            send(res, 200, { ok: true, outcome, emailSent: false, token: "local-preview" });
          } catch {
            send(res, 400, { ok: false, error: "Invalid request" });
          }
          return;
        }

        if (url === "/api/time-now" && req.method === "POST") {
          try {
            const body = JSON.parse(await readBody(req)) as { token?: string; answer?: string };
            if (!body.token) return send(res, 400, { ok: false, error: "Missing token" });
            if (body.answer !== "yes" && body.answer !== "no") return send(res, 400, { ok: false, error: "Choose Yes or No." });
            send(res, 200, { ok: true, time_now: body.answer });
          } catch {
            send(res, 400, { ok: false, error: "Invalid request" });
          }
          return;
        }

        if (url === "/api/applied" && (req.method === "POST" || req.method === "GET")) {
          try {
            let token = "";
            if (req.method === "POST") {
              const body = JSON.parse((await readBody(req)) || "{}") as { token?: string };
              token = String(body.token || "");
            } else {
              token = new URL(req.url || "", "http://127.0.0.1").searchParams.get("t") || "";
            }
            if (scriptUrl) {
              const upstream = await fetch(scriptUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ secret, action: "applied", token }),
              });
              const data = (await upstream.json().catch(() => null)) as {
                ok?: boolean;
                already?: boolean;
              } | null;
              if (!upstream.ok || !data?.ok) {
                send(res, 502, { ok: false, error: "Could not update your status." });
                return;
              }
              send(res, 200, { ok: true, already: Boolean(data.already) });
              return;
            }
            send(res, 200, { ok: true, already: false });
          } catch {
            send(res, 400, { ok: false, error: "Invalid request" });
          }
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), applyDevApi()],
  server: {
    host: "127.0.0.1",
    port: 18741,
    strictPort: true,
  },
});
