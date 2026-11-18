/* =========================================================
   Free AI back end for the portfolio assistant.
   Runs on Cloudflare Workers (free plan) and calls Google Gemini
   (free tier). Your API key stays secret on Cloudflare.
   Setup steps: see AI-SETUP.md
   ========================================================= */

const ALLOWED_ORIGINS = [
  "https://jaypreet-singh.github.io"
];
// The Worker finds a working Gemini "Flash" model automatically (Google renames models over time).
// To force a specific model, add a plain-text variable GEMINI_MODEL in Cloudflare settings.
const PREFERRED = ["gemini-flash-latest", "gemini-flash-lite-latest"];
let cachedModel = null;
let modelList = null;
let cachedThink;

const PROFILE = `
NAME: Jaypreet Singh. Data Engineer & BI Analyst. New York City area; open to Data Engineer and BI Analyst roles anywhere in the USA (on-site, hybrid or remote).
CONTACT: s.jaypreet@gmail.com · linkedin.com/in/jaypreet-singh · github.com/jaypreet-singh · portfolio: jaypreet-singh.github.io
SUMMARY: 5+ years building ETL/ELT pipelines, data models and dashboards across on-prem and cloud; served 30+ enterprise clients; HIPAA-compliant analytics; ML forecasting.

EXPERIENCE
1) NStarX Inc. (Ballwin, MO) — Data Engineer, Jan 2026–present.
 Built the analytics suite for Agentra (NStarX's expense management product): 12-table Power BI star schema (departments, vendors, projects, employees); 1,700+ transactions and 400+ reimbursement vouchers; rules engine based on the employee handbook and IRS mileage guidelines with seven independent compliance checks and fixed-size lookup tables; 25+ DAX measures (RANKX spend-concentration curve, SWITCH over a disconnected lookup table) powering a multi-page report (KPI cards, trend lines, combo, donut/bar charts); composite fraud-risk score using statistical thresholds that catches missing receipts, late-booked travel, policy overages and duplicate submissions, flagging $94K in spend; variance analysis found a $61K (26%) budget overrun and a $19K vendor-consolidation saving; department Row-Level Security with workspace RBAC (Viewer/Contributor/Admin); authored the Travel & Expense Policy Handbook; policy limits kept in a governed dimension table.
2) NStarX Inc. — Data Analyst Intern, May–Aug 2025.
 Benchmarked Tableau, Power BI, Domo and Qlik Sense for a client's enterprise rollout (scalability, security, portability, white-labeling, usability); simulated high-concurrency stress tests; custom datasets from Amazon Redshift and Google Analytics; live-data dashboard prototype on Redshift; compared Domo's built-in ML forecasting with custom Python ARIMA; prototyped migration from QuickSight and Looker.
3) Populus Health Technologies (Princeton, NJ; virtual-care patient acquisition for life-science brands) — Data Engineer, Jan 2021–Jul 2024 (started as IT Intern Jan–May 2021).
 BI: built and maintained the complete Looker analytics suite; executive dashboards for 30+ clients and internal teams; LookML semantic models and custom fields; row-level security by client; RBAC; HIPAA-compliant handling; weekly statistical market analysis reports; ad-hoc reporting.
 Data engineering: resilient Python ETL pipeline for the public NPI Registry API (rate-limit throttling, checkpoint restarts, fail-safe logging, 100% validation across 500K+ records); MySQL, BigQuery and GA4 transformations; bulk extraction automated with Python and AWS Lambda.
 Campaigns: technical launch support for digital health campaigns; site-served HTML and video creatives; integrations with DoubleVerify, Crossix and IQVIA; 100+ test pages (HTML/CSS/JS on GitHub Pages) for client QA; troubleshooting.
 Delivery: Agile; requirements, documentation, testing, production deployment; led a project instance migration.
 IT intern: Google Data Studio dashboards, campaign pacing by partner, test pages in Node.js/HTML/Bootstrap.
4) VI Solutions, Bengaluru — Intern, Jul–Aug 2020: Automatic Test Procedure in LabVIEW with NI-DAQmx/myDAQ; automatic Word test reports.
5) Tata Steel, Jamshedpur — Summer Intern, May–Aug 2019: real-time water temperature and dissolved-oxygen monitoring streamed to Adafruit IO.

PROJECTS
- Port Authority of NY & NJ capstone (UNH, Aug–Dec 2025, team of 5; Jaypreet led data integration/automation, wrote forecasting scripts, ran Azure AutoML, built the Looker Studio dashboard): 8 facilities, weather, holidays, toll prices; ElasticNet, Random Forest/XGBoost, XGBoost+LightGBM voting ensemble (R² 0.994), ARIMAX, Prophet, SARIMAX. Findings: traffic fell from 195.7M (2024) to 170.9M (2025), −12.7%, after congestion pricing, shifting to Goethals and Outerbridge; 5.7M toll violations in 2025 (peak May ~390K); July busiest (13.9M), February slowest; Thursdays/Fridays busiest; growth forecast to 2030.
- Port Authority bus terminal forecasting (UNH, Feb–May 2025, team of 5; Jaypreet built Prophet terminal forecasts and XGBoost per-carrier forecasts, K-Means and Random Forest): MS Access data 2005–2024; ~188M passengers 2025–2030 (Midtown ~180M, GWB Bus Station ~8M); 14 carriers (NJ Transit, Greyhound, Hudson Transit lead at 16–18M); GWB 403.8M vehicles 2025–2030; Power BI dashboard.
- Power BI reporting coursework (UNH, Sep–Dec 2024): star schema, complex DAX.
- Breast cancer detection with SVM (B.E. final-year, 2021, team of 2): 30 features, 98% accuracy.
- LabVIEW ATP (VI Solutions) and IoT water monitoring (Tata Steel).

EDUCATION: Master's in Business Analytics (Global Supply Chain Analytics concentration), University of New Haven, Aug 2024–Jan 2026. B.E. Electronics & Communication Engineering, RNS Institute of Technology (VTU), Bengaluru, 2016–2021.
CERTIFICATIONS: The AI Engineer Course 2026 (Udemy, Feb 2026); Data Analytics for Databricks (Databricks Academy, May 2025); The Ultimate MySQL Bootcamp (Udemy); Advanced Google Analytics; R (Programming Language); Learn About JSON with JavaScript.
SKILLS: SQL (advanced), Python (Pandas, NumPy, scikit-learn, Prophet, XGBoost), R, JavaScript, HTML/CSS; MySQL, SQL Server, BigQuery, Redshift, MS Access; ETL/ELT, SSIS, SSAS, star/snowflake schema, data warehousing; Power BI (DAX, Power Query, gateways, admin), Looker/LookML, Looker Studio, Tableau, Domo, Qlik Sense, QuickSight, Excel/VBA; AWS (Redshift, S3, Lambda), GCP (BigQuery, Vertex AI, GA4), Azure AutoML, Databricks, Apache Spark; ML forecasting, classification, clustering, AutoML, BigQuery ML, generative AI, prompt engineering, Claude Code; RLS, RBAC, HIPAA, data governance, data validation; Agile.
NOT IN HIS LISTED EXPERIENCE (say so honestly if asked): Snowflake (the warehouse), dbt, Airflow, Kafka, Scala, Java, Docker, Kubernetes, Terraform, deep learning frameworks, NLP.
`;

const SYSTEM = `You are the assistant on Jaypreet Singh's portfolio website, talking to recruiters and hiring managers.
Rules:
- For anything about Jaypreet, use ONLY the PROFILE below. Never invent employers, dates, numbers, tools, salary, visa status or personal details. If the profile doesn't say, reply that you don't have that detail and suggest emailing s.jaypreet@gmail.com.
- Salary, visa/work authorization and interview scheduling: always direct them to s.jaypreet@gmail.com.
- You may answer general data/analytics questions (e.g. "what is a star schema?") briefly from general knowledge, and connect them to Jaypreet's relevant work when it fits.
- Refer to him in the third person ("he", "Jaypreet"). Be warm, concise and professional: at most about 120 words, plain sentences, use **bold** sparingly, no headings.
- Politely decline unrelated requests (coding tasks, essays, etc.) and steer back to Jaypreet's experience.
PROFILE:
${PROFILE}`;

function cors(origin) {
  const ok = ALLOWED_ORIGINS.includes(origin);
  return {
    "Access-Control-Allow-Origin": ok ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin"
  };
}
function json(body, status, origin) {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", ...cors(origin) } });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(origin) });
    if (request.method !== "POST") return json({ error: "POST only" }, 405, origin);
    if (!ALLOWED_ORIGINS.includes(origin)) return json({ error: "Origin not allowed" }, 403, origin);
    if (!env.GEMINI_API_KEY) return json({ error: "Missing GEMINI_API_KEY secret" }, 500, origin);

    let data;
    try { data = await request.json(); } catch { return json({ error: "Bad JSON" }, 400, origin); }
    const question = String(data.question || "").slice(0, 500).trim();
    if (!question) return json({ error: "Empty question" }, 400, origin);
    const history = Array.isArray(data.history) ? data.history.slice(-6) : [];

    const contents = history
      .filter(h => h && (h.role === "user" || h.role === "model") && h.text)
      .map(h => ({ role: h.role, parts: [{ text: String(h.text).slice(0, 800) }] }));
    contents.push({ role: "user", parts: [{ text: question }] });

    const t0 = Date.now();
    // Newer Flash models "think" before answering, which is slow. Turn thinking off/minimal.
    // Different model generations use different settings, so try each and remember what works.
    const THINK = [{ thinkingLevel: "minimal" }, { thinkingBudget: 0 }, null];
    const call = async (model) => {
      const opts = cachedThink !== undefined && cachedModel === model ? [cachedThink] : THINK;
      let res = null;
      for (const t of opts) {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 12000);
        try {
          res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
            method: "POST", signal: ctrl.signal,
            headers: { "Content-Type": "application/json", "x-goog-api-key": env.GEMINI_API_KEY },
            body: JSON.stringify({
              system_instruction: { parts: [{ text: SYSTEM }] },
              contents,
              generationConfig: Object.assign({ temperature: 0.3, maxOutputTokens: 600 }, t ? { thinkingConfig: t } : {})
            })
          });
        } catch (e) { res = new Response("{}", { status: 504 }); }
        clearTimeout(timer);
        if (res.status === 400 && t) continue;      // this thinking setting isn't supported by this model
        if (res.ok) cachedThink = t;
        return res;
      }
      return res;
    };
    // Build the list of models to try: the one that worked last time, then models this key can use
    // (stable Flash first, then Flash-Lite, then preview), then the "latest" aliases.
    if (!modelList) {
      try {
        const list = await fetch("https://generativelanguage.googleapis.com/v1beta/models?pageSize=200", { headers: { "x-goog-api-key": env.GEMINI_API_KEY } });
        if (list.ok) {
          modelList = ((await list.json()).models || [])
            .filter(m => (m.supportedGenerationMethods || []).includes("generateContent"))
            .map(m => m.name.replace(/^models\//, ""))
            .filter(n => /flash/i.test(n) && !/(image|tts|audio|live|vision|embedding|thinking|exp|native)/i.test(n));
          const rank = n => (/preview/.test(n) ? 2 : 0) + (/lite/.test(n) ? 1 : 0) + (/latest/.test(n) ? 3 : 0);
          modelList.sort((a, b) => rank(a) - rank(b) || b.localeCompare(a, undefined, { numeric: true }));
        }
      } catch (e) { /* fall back to aliases */ }
    }
    const candidates = [...new Set([env.GEMINI_MODEL, cachedModel, ...(modelList || []).slice(0, 5), ...PREFERRED].filter(Boolean))];
    const RETRYABLE = [404, 429, 500, 503, 504];
    let tried = [], r = null;
    for (const m of candidates) {
      if (Date.now() - t0 > 22000) break;            // never keep a visitor waiting too long
      tried.push(m); r = await call(m);
      if (r.ok) { cachedModel = m; break; }
      if (!RETRYABLE.includes(r.status)) break;      // e.g. bad key: no point trying other models
      if (m === cachedModel) cachedModel = null;
    }
    if (!r || !r.ok) return json({ error: "AI service error", status: r ? r.status : 0, tried, ms: Date.now() - t0 }, 502, origin);
    const out = await r.json();
    const answer = (out.candidates?.[0]?.content?.parts || []).map(p => p.text || "").join("").trim();
    if (!answer) return json({ error: "No answer" }, 502, origin);
    return json({ answer, model: cachedModel, ms: Date.now() - t0 }, 200, origin);
  }
};
