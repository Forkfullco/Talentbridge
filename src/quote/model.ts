// TalentBridge valuation model and question data (ported from the Tracework flow).
// Low end ($K) = Σ source weights × team multiplier × history multiplier × sector multiplier.
// High end = low × SPREAD.

export type Source = { key: string; label: string; eg: string; points: number };

export const SOURCES: Source[] = [
  { key: "email", label: "Email inboxes", eg: "Gmail, Outlook", points: 12 },
  { key: "chat", label: "Team messaging", eg: "Slack, Teams", points: 13 },
  { key: "crm", label: "Sales and CRM", eg: "Salesforce, HubSpot", points: 17 },
  { key: "finance", label: "Finance and ERP", eg: "NetSuite, QuickBooks", points: 17 },
  { key: "support", label: "Customer support", eg: "Zendesk, Intercom", points: 15 },
  { key: "code", label: "Source code and reviews", eg: "GitHub, GitLab", points: 19 },
  { key: "calls", label: "Recorded calls and meetings", eg: "Zoom, Gong", points: 13 },
  { key: "docs", label: "Docs and file storage", eg: "Drive, SharePoint", points: 8 },
  { key: "projects", label: "Project tracking", eg: "Jira, Asana, Linear", points: 10 },
  { key: "commerce", label: "Orders and checkout", eg: "Shopify, Square", points: 9 },
  { key: "field", label: "Field and job management", eg: "ServiceTitan, Procore", points: 12 },
  { key: "design", label: "Engineering drawings and CAD", eg: "SolidWorks, Revit", points: 17 },
  { key: "warehouse", label: "Databases and warehouses", eg: "Postgres, Snowflake", points: 10 },
  { key: "legal", label: "Contracts and signatures", eg: "DocuSign, Ironclad", points: 11 },
  { key: "people", label: "HR and hiring", eg: "Workday, Greenhouse", points: 6 },
];

const TEAM_CURVE: [number, number][] = [[1, 0.8], [10, 1.1], [25, 1.4], [50, 1.9], [100, 3], [250, 5], [500, 7.5], [1000, 11]];
export const SECTOR_FACTOR: Record<string, number> = {
  "Accounting & tax": 1.05, "Aerospace & defense": 1.1, Biotech: 1.1, Construction: 1.15,
  "Consulting & services": 1, "Financial services": 1.15, Healthcare: 1, Hospitality: 0.85, Insurance: 1.1,
  "IT & managed services": 0.95, Legal: 1.2, Logistics: 1, Manufacturing: 1.05, "Marketing & agencies": 0.9,
  "Real estate": 0.95, "Retail & e-commerce": 0.9, Semiconductors: 1.15, Software: 1.1, Staffing: 0.95, Other: 0.95,
};
export const SPREAD = 2.4;
const MAX_LOW = 2800;

export type Option = [string, string] | string;

export const REFERRER = "I’m introducing a company";
export const ROLES: Option[] = [
  ["Founder or CEO", "I make the final call"],
  ["Former owner", "The business has closed or shut down"],
  ["Operations", "I own how work flows through the company"],
  ["Finance or strategy", "I own budgets, deals and the roadmap"],
  ["Engineering or data", "I own our systems and what’s in them"],
  [REFERRER, "I know the owner and want to make an introduction"],
];
export const SECTORS: Option[] = Object.keys(SECTOR_FACTOR);
export const SOFTWARE: Option[] = [
  ["B2B application", "CRM, HR, finance, vertical tools"],
  "Consumer app or marketplace",
  "Developer or data infrastructure",
  "Security",
  "Games and media",
  "Embedded or industrial",
];
export const HISTORY: [number, string][] = [[1.6, "More than 15 years"], [1.35, "8 to 15 years"], [1.1, "4 to 7 years"], [0.8, "1 to 3 years"], [0.5, "Less than a year"]];

export type TeamStop = { tick: string; major: boolean; n: number; label: string };
export const TEAM: TeamStop[] = (
  [[1, 9, "1", 1], [10, 24, "10", 1], [25, 49, "25", 1], [50, 99, "50", 1], [100, 249, "100", 1], [250, 499, "250", 1], [500, 999, "500", 1], [1000, 1000, "1k+", 1]] as [number, number, string, number][]
).map(([lo, hi, tick, major]) => ({
  tick,
  major: !!major,
  n: lo === hi ? lo : Math.round((lo + hi) / 2),
  label: lo === hi ? "1,000+" : `${lo}–${hi}`,
}));
export const TEAM_START = 3;

export const CUSTOMERS = ["< 100", "100s", "1,000s", "10,000s", "100,000s", "Millions", "Not sure"];
export const REVENUE = ["< $1M", "$1–10M", "$10–50M", "$50–250M", "$250M+", "Rather not say"];

export const LANGUAGES = ["English", "Spanish", "French", "German", "Portuguese", "Italian", "Dutch", "Polish", "Swedish",
  "Turkish", "Arabic", "Hebrew", "Hindi", "Chinese", "Japanese", "Korean", "Vietnamese", "Indonesian", "Other"];

export const PLATFORMS: Record<string, string[]> = {
  email: ["Gmail", "Outlook", "Exchange", "Front"],
  chat: ["Slack", "Microsoft Teams", "Google Chat", "Discord"],
  crm: ["Salesforce", "HubSpot", "Dynamics", "Pipedrive", "Attio"],
  finance: ["NetSuite", "QuickBooks", "Xero", "SAP", "Sage"],
  support: ["Zendesk", "Intercom", "Freshdesk", "ServiceNow", "Help Scout"],
  code: ["GitHub", "GitLab", "Bitbucket", "Azure DevOps"],
  calls: ["Zoom", "Google Meet", "Gong", "Aircall"],
  docs: ["Google Drive", "SharePoint", "Dropbox", "Box", "Notion"],
  projects: ["Jira", "Asana", "Linear", "monday.com", "ClickUp"],
  commerce: ["Shopify", "Square", "WooCommerce", "Toast"],
  field: ["ServiceTitan", "Procore", "Jobber", "Samsara"],
  design: ["AutoCAD", "Revit", "SolidWorks", "Fusion 360", "Figma"],
  warehouse: ["PostgreSQL", "Snowflake", "BigQuery", "Databricks"],
  legal: ["DocuSign", "PandaDoc", "Ironclad"],
  people: ["Workday", "Rippling", "Gusto", "Greenhouse"],
};

export const RIGHTS: Option[] = [
  ["It’s all ours", "Our systems, our records, our call"],
  ["Probably", "A few things to double-check"],
  ["Partly", "Some is bound by client agreements"],
  ["Don’t know yet", "We’d have to read our contracts"],
];
export const TIMING = ["This quarter", "This year", "Exploring", "Just curious"];

export type Answers = {
  role?: string;
  sector?: string;
  software?: string;
  history?: string;
  team?: number;
  customers?: string;
  revenue?: string;
  languages?: string[];
  sources?: string[];
  platforms?: Record<string, string[]>;
  rights?: string;
  timing?: string;
};

export function fmt(k: number) {
  if (k >= 1000) return "$" + Math.round(k / 100) / 10 + "M";
  return "$" + Math.round(k) + "K";
}
export function round5(k: number) {
  return k >= 1000 ? Math.round(k / 50) * 50 : Math.max(5, Math.round(k / 5) * 5);
}
function interp(curve: [number, number][], x: number) {
  if (x <= curve[0][0]) return curve[0][1];
  for (let i = 1; i < curve.length; i++) {
    if (x <= curve[i][0]) {
      const p = curve[i - 1], q = curve[i];
      return p[1] + ((q[1] - p[1]) * (x - p[0])) / (q[0] - p[0]);
    }
  }
  return curve[curve.length - 1][1];
}

export type Estimate = { sources: Source[]; share: number; low: number; high: number; score: number; tier: string };

export function estimate(a: Answers): Estimate {
  const emp = a.team != null ? TEAM[a.team].n : 25;
  const hist = HISTORY.find((h) => h[1] === a.history)?.[0] ?? 1;
  const sector = (a.sector && SECTOR_FACTOR[a.sector]) || 1;
  const langBoost = 1 + Math.max(0, (a.languages?.length ?? 1) - 1) * 0.05;
  const factor = interp(TEAM_CURVE, emp) * hist * sector * langBoost;
  const srcs = SOURCES.filter((s) => (a.sources || []).includes(s.key));
  const points = srcs.reduce((sum, s) => sum + s.points, 0);
  const low = Math.min(points * factor, MAX_LOW);
  const share = points ? low / points : 0;
  let score = low ? Math.max(1, Math.min(5, Math.ceil((Math.log(low / 5) / Math.log(1000 / 5)) * 5))) : 1;
  if (a.rights === "Partly" || a.rights === "Don’t know yet") score = Math.max(1, score - 1);
  const tier = score >= 4 ? "Priority listing" : score >= 3 ? "Strong candidate" : "Worth a review";
  return { sources: srcs, share, low: low ? round5(low) : 0, high: low ? round5(low * SPREAD) : 0, score, tier };
}
