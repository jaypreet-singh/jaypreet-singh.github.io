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
const PREFERRED = ["gemini-flash-lite-latest", "gemini-flash-latest"];
let cachedModel = null;
let cachedStrong = null;
const cooldown = {};
const hits = new Map();
let modelList = null;
let cachedThink;

const PROFILE = `
NAME: Jaypreet Singh. Data Engineer & BI Analyst. New York City area; open to Data Engineer and BI Analyst roles anywhere in the USA (on-site, hybrid or remote).
STARTUPS: Open to startup collaboration in the US. If a founder already has an idea, he can step in as the technical partner to build the product, data and tech; he is also open to co-founding a new tech product from scratch, or joining early as a founding engineer or advisor on tech and data strategy. Open to any industry and any stage where technology is central. Founders can pitch via the Contact form or s.jaypreet@gmail.com.
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
SKILLS USED IN HIS WORK OR PROJECTS (you may tie these to the roles/projects above): SQL (advanced); Python (pandas, NumPy, scikit-learn, Prophet, XGBoost, LightGBM); MySQL, BigQuery, Amazon Redshift, Google Analytics 4, MS Access; AWS Lambda; Power BI with DAX (NStarX); Looker/LookML (Populus); Looker Studio (capstone dashboard), Google Data Studio (IT intern); Tableau, Domo, Qlik Sense (benchmark), QuickSight and Looker (migration prototype); Azure AutoML, ARIMA/ARIMAX/SARIMAX, ElasticNet, Random Forest, K-Means, SVM; RLS, RBAC, HIPAA; Agile; HTML/CSS/JavaScript, Node.js, Bootstrap, GitHub Pages (campaign test pages); LabVIEW, NI-DAQmx.
SKILLS LISTED ON HIS RESUME WITHOUT A SPECIFIC DESCRIBED PROJECT (say "listed among his skills", never attach them to a project): R, SQL Server, SSIS, SSAS, Power Query, star/snowflake schema design generally, Amazon S3, Google Cloud Vertex AI, BigQuery ML, Databricks (certified via Databricks Academy), Apache Spark, Excel/VBA, generative AI and prompt engineering, Claude Code, REST API integration.
NOT IN HIS LISTED EXPERIENCE (say so honestly if asked): Snowflake (the warehouse), dbt, Airflow, Kafka, Scala, Java, Docker, Kubernetes, Terraform, deep learning frameworks, NLP.
`;

const SYSTEM = `You are the assistant on Jaypreet Singh's portfolio website. You talk to recruiters and hiring managers.

FACTS
- Anything you say Jaypreet did, built, used or achieved must come from the PROFILE below. Never invent employers, dates, numbers, tools, clients, salary, visa status or personal details.
- Never attach a tool to a role or project unless the PROFILE ties them together. Tools in the "listed without a specific project" group are only "listed among his skills".
- Team projects (both Port Authority projects, the SVM project): say "his team" for team results and describe his own part accurately.
- If the PROFILE doesn't cover something, say you don't have that detail.

APPROACH QUESTIONS ("how would he…", "what would he do…")
- Give a sound, practical approach using conditional wording ("he would typically…", "a solid approach is…"). Then name one or two real, related things from the PROFILE as evidence. Never present general best practice as something he has done.

FIT QUESTIONS (job titles, job descriptions, "is he a fit")
- Be honest and useful: name the matching experience, name any gaps plainly, and point out the closest transferable experience (for example LookML semantic modeling and star schemas for dbt-style modeling; BigQuery/Redshift for Snowflake).

GENERAL DATA QUESTIONS
- Answer briefly from general knowledge, then connect to his relevant work in one sentence if there is a real link.

OFF-TOPIC
- Politely decline unrelated tasks (writing code, essays, personal topics) in one sentence and offer to talk about his experience.

STYLE
- Third person ("he", "Jaypreet"). Warm, confident, specific. 60–140 words.
- Use short paragraphs, or 2–5 "- " bullets when listing. Use **bold** for at most two key phrases. No headings, no emojis.
- Only mention s.jaypreet@gmail.com for contact, salary, visa or scheduling questions, or when you lack a detail. Do not end every answer with it.

PROFILE:
${PROFILE}`;

async function timedFetch(url, opts = {}, ms = 10000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try { return await fetch(url, { ...opts, signal: ctrl.signal }); }
  catch (e) { return new Response(JSON.stringify({ error: String(e) }), { status: 504 }); }
  finally { clearTimeout(timer); }
}

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
    const url = new URL(request.url);
    if (request.method === "GET" && url.searchParams.get("diag") === "1") {
      // Safe self-check (never shows the key): is the key set, which models can it use, does one answer?
      const out = { version: "2026-11-22d", keySet: !!env.GEMINI_API_KEY };
      if (!env.GEMINI_API_KEY) return json(out, 200, origin);
      let t = Date.now();
      const list = await timedFetch("https://generativelanguage.googleapis.com/v1beta/models?pageSize=200", { headers: { "x-goog-api-key": env.GEMINI_API_KEY } }, 8000);
      out.listStatus = list.status; out.listMs = Date.now() - t;
      let body = {}; try { body = await list.json(); } catch (e) {}
      if (!list.ok) out.listError = body.error && body.error.message;
      out.flashModels = (body.models || []).filter(m => (m.supportedGenerationMethods || []).includes("generateContent") && /flash/i.test(m.name)).map(m => m.name.replace("models/", ""));
      const ver = n => parseFloat((n.match(/gemini-(\d+(?:\.\d+)?)/) || [0, 0])[1]);
      out.order = out.flashModels.filter(n => /^gemini-\d+(\.\d+)?-flash(-lite)?(-preview)?$/i.test(n)).sort((a, b) => (/lite/.test(a) - /lite/.test(b)) || ver(b) - ver(a));
      out.cooldown = Object.keys(cooldown).filter(k => cooldown[k] > Date.now());
      const pick = url.searchParams.get("model") || out.order.find(n => /lite/.test(n)) || out.flashModels[0];
      if (pick) {
        t = Date.now();
        const r = await timedFetch(`https://generativelanguage.googleapis.com/v1beta/models/${pick}:generateContent`, { method: "POST", headers: { "Content-Type": "application/json", "x-goog-api-key": env.GEMINI_API_KEY }, body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: "Say OK" }] }], generationConfig: { maxOutputTokens: 20 } }) }, 15000);
        out.test = { model: pick, status: r.status, ms: Date.now() - t };
        try { const d = await r.json(); out.test.reply = (d.candidates?.[0]?.content?.parts || []).map(p => p.text || "").join("").slice(0, 60); if (!r.ok) out.test.error = d.error && d.error.message; } catch (e) {}
      }
      const strongName = out.order.find(n => !/lite/.test(n));
      if (strongName) {
        t = Date.now();
        const r2 = await timedFetch(`https://generativelanguage.googleapis.com/v1beta/models/${strongName}:generateContent`, { method: "POST", headers: { "Content-Type": "application/json", "x-goog-api-key": env.GEMINI_API_KEY }, body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: "Say OK" }] }], generationConfig: { maxOutputTokens: 200, thinkingConfig: { thinkingLevel: "minimal" } } }) }, 15000);
        out.strongTest = { model: strongName, status: r2.status, ms: Date.now() - t };
      }
      return json(out, 200, origin);
    }
    if (request.method !== "POST") return json({ error: "POST only" }, 405, origin);
    if (!ALLOWED_ORIGINS.includes(origin)) return json({ error: "Origin not allowed" }, 403, origin);
    if (!env.GEMINI_API_KEY) return json({ error: "Missing GEMINI_API_KEY secret" }, 500, origin);

    // Basic abuse protection: at most 20 questions per minute per visitor.
    const ip = request.headers.get("CF-Connecting-IP") || "?";
    const now = Date.now(), w = (hits.get(ip) || []).filter(t => now - t < 60000);
    if (w.length >= 20) return json({ error: "Too many questions, please wait a minute" }, 429, origin);
    w.push(now); hits.set(ip, w); if (hits.size > 5000) hits.clear();

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
        res = await timedFetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-goog-api-key": env.GEMINI_API_KEY },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: SYSTEM }] },
            contents,
            generationConfig: Object.assign({ temperature: 0.2, maxOutputTokens: 500 }, t ? { thinkingConfig: t } : {})
          })
        }, 9000);
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
        const list = await timedFetch("https://generativelanguage.googleapis.com/v1beta/models?pageSize=200", { headers: { "x-goog-api-key": env.GEMINI_API_KEY } }, 6000);
        if (list.ok) {
          modelList = ((await list.json()).models || [])
            .filter(m => (m.supportedGenerationMethods || []).includes("generateContent"))
            .map(m => m.name.replace(/^models\//, ""))
            .filter(n => /^gemini-\d+(\.\d+)?-flash(-lite)?(-preview)?$/i.test(n));   // numbered Flash / Flash-Lite text models (incl. previews)
          // Flash-Lite first (fast and available on the free tier), newest version first; then full Flash.
          const ver = n => parseFloat((n.match(/gemini-(\d+(?:\.\d+)?)/) || [0, 0])[1]);
          modelList.sort((a, b) => (/lite/.test(b) - /lite/.test(a)) || ver(b) - ver(a));
        }
      } catch (e) { /* fall back to aliases */ }
    }
    // Best free models first: full Flash (smarter) raced against Flash-Lite (fast, reliable).
    // Up to 3 full-Flash models are asked at once; the first good full-Flash answer within ~6.5 s wins,
    // otherwise the Flash-Lite answer is used. Busy models are skipped for 5 minutes.
    const ver = n => parseFloat((n.match(/gemini-(\d+(?:\.\d+)?)/) || [0, 0])[1]);
    const textModel = n => /^gemini-\d+(\.\d+)?-flash(-lite)?(-preview)?$/i.test(n);
    const all = [...new Set([env.GEMINI_MODEL, ...(modelList || []), ...PREFERRED].filter(Boolean))];
    const strongAll = all.filter(n => textModel(n) && !/lite/.test(n) && !(cooldown[n] > Date.now())).sort((a, b) => ver(b) - ver(a));
    // Once a full-Flash model has worked, use just that one; otherwise test all of them at once.
    const strong = cachedStrong && !(cooldown[cachedStrong] > Date.now()) ? [cachedStrong] : strongAll.slice(0, 8);
    const fast = [...new Set([cachedModel, ...all.filter(n => /lite/.test(n) && (textModel(n) || /latest/.test(n))).sort((a, b) => ver(b) - ver(a))].filter(Boolean))]
      .filter(n => /lite/.test(n));
    const tried = [];
    const attempt = async (m) => {
      tried.push(m);
      const res = await call(m);
      let text = "";
      if (res.ok) { try { const d = await res.json(); text = (d.candidates?.[0]?.content?.parts || []).map(p => p.text || "").join("").trim(); } catch (e) {} }
      if ([429, 503, 504].includes(res.status) || (res.ok && !text)) cooldown[m] = Date.now() + 5 * 60 * 1000;
      if (res.status === 404) cooldown[m] = Date.now() + 24 * 60 * 60 * 1000;     // retired model: skip for a day
      if (m === cachedStrong && !text) cachedStrong = null;
      return { m, status: res.status, text };
    };
    const firstText = async (list, max) => {
      let last = null;
      for (const m of list.slice(0, max)) { last = await attempt(m); if (last.text) return last; if (![404, 429, 500, 503, 504, 200].includes(last.status)) break; }
      return last;
    };
    const fastP = firstText(fast, 3);
    const strongP = strong.length ? new Promise(resolve => {
      let pending = strong.length;
      strong.forEach(m => attempt(m).then(x => { if (x.text) resolve(x); else if (--pending === 0) resolve(null); }));
      setTimeout(() => resolve(null), 6500);
    }) : Promise.resolve(null);
    let pick = await strongP;
    if (pick) cachedStrong = pick.m;
    else pick = await fastP;
    if (pick && pick.text && /lite/.test(pick.m)) cachedModel = pick.m;
    if (!pick || !pick.text) return json({ error: "AI service error", status: pick ? pick.status : 0, tried, ms: Date.now() - t0 }, 502, origin);
    return json({ answer: pick.text, model: pick.m, ms: Date.now() - t0 }, 200, origin);
  }
};
