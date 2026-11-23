/* =========================================================
   Interactive features: Ask-me assistant, Job-match checker,
   Startup pitch buttons, Cmd+K search.
   Everything runs in the browser: free, no API key, no server.
   ========================================================= */

/* ---------- Skills: what Jaypreet has, with proof ---------- */
/* [label, [synonyms], evidence text, link ("case:<id>" or "#tab")] */
var SKILLS_HAVE = [
  ["SQL", ["sql", "t-sql", "advanced sql"], "Daily across MySQL, BigQuery, Redshift and SQL Server", "#skills"],
  ["Python", ["python", "pandas", "numpy"], "NPI pipeline, Port Authority models", "case:npi"],
  ["R", ["\\br\\b(?! ?&)", "r programming"], "Listed skill and certification", "#about"],
  ["ETL / ELT", ["etl", "elt", "data pipeline", "data pipelines", "data ingestion", "ingestion"], "Resilient NPI Registry pipeline, 500K+ records", "case:npi"],
  ["Data modeling", ["data model", "data modeling", "data modelling", "dimensional model", "star schema", "snowflake schema", "semantic model", "semantic layer"], "12-table star schema for Agentra; LookML semantic models", "case:agentra"],
  ["Data warehousing", ["data warehouse", "data warehousing", "warehouse"], "BigQuery and Redshift warehouses", "#skills"],
  ["Power BI", ["power bi", "powerbi"], "Agentra analytics suite at NStarX", "case:agentra"],
  ["DAX", ["dax"], "25+ DAX measures (RANKX, SWITCH)", "case:agentra"],
  ["Power Query", ["power query", "m language"], "Power BI modeling", "#skills"],
  ["Looker / LookML", ["looker", "lookml"], "Full Looker suite for 30+ clients", "case:looker-suite"],
  ["Looker Studio", ["looker studio", "data studio", "google data studio"], "Port Authority capstone dashboard", "case:pa-capstone"],
  ["Tableau", ["tableau"], "BI platform benchmark", "case:bi-benchmark"],
  ["Qlik", ["qlik"], "BI platform benchmark", "case:bi-benchmark"],
  ["Domo", ["domo"], "BI platform benchmark", "case:bi-benchmark"],
  ["QuickSight", ["quicksight", "quick sight"], "Prototyped migration from QuickSight", "case:bi-benchmark"],
  ["Dashboards & reporting", ["dashboard", "dashboards", "reporting", "data visualization", "visualisation", "visualization", "kpi", "kpis", "business intelligence", "\\bbi\\b"], "Executive dashboards for 30+ clients", "case:looker-suite"],
  ["Excel / VBA", ["excel", "vba", "pivot table", "pivot tables", "vlookup", "xlookup"], "Advanced Excel skill set", "#skills"],
  ["MySQL", ["mysql"], "Populus reporting pipelines", "case:looker-suite"],
  ["SQL Server", ["sql server", "mssql", "ssms"], "Listed platform skill", "#skills"],
  ["SSIS / SSAS", ["ssis", "ssas"], "Listed platform skill", "#skills"],
  ["BigQuery", ["bigquery", "big query"], "Populus data engineering", "case:looker-suite"],
  ["Redshift", ["redshift"], "Live Redshift prototype at NStarX", "case:bi-benchmark"],
  ["AWS", ["aws", "amazon web services", "s3", "lambda"], "AWS Lambda automation, Redshift, S3", "case:npi"],
  ["GCP", ["gcp", "google cloud"], "BigQuery, Vertex AI, GA4", "#skills"],
  ["Azure", ["azure", "azure ml", "azure machine learning"], "Azure AutoML in the Port Authority capstone", "case:pa-capstone"],
  ["Databricks", ["databricks"], "Databricks Academy certification", "#about"],
  ["Apache Spark", ["spark", "pyspark"], "Listed big-data skill", "#skills"],
  ["Machine learning", ["machine learning", "\\bml\\b", "scikit-learn", "sklearn", "predictive model", "predictive modeling", "predictive analytics", "classification", "regression", "random forest", "clustering", "k-means", "svm"], "Port Authority models; SVM classifier at 98%", "case:pa-capstone"],
  ["Forecasting / time series", ["forecast", "forecasting", "time series", "time-series", "prophet", "arima", "sarimax"], "Traffic and passenger forecasts to 2030", "case:pa-forecast"],
  ["XGBoost / LightGBM", ["xgboost", "lightgbm", "gradient boosting"], "Carrier forecasts and ensemble models", "case:pa-forecast"],
  ["AutoML", ["automl", "vertex ai", "bigquery ml"], "Azure AutoML model selection", "case:pa-capstone"],
  ["Generative AI / LLMs", ["generative ai", "genai", "gen ai", "llm", "llms", "prompt engineering", "large language model"], "AI Engineer Bootcamp; LLM-assisted development", "#about"],
  ["Statistics", ["statistics", "statistical", "variance analysis", "hypothesis"], "Variance and concentration analysis; weekly market reports", "case:agentra"],
  ["APIs", ["api", "apis", "rest api", "restful", "rest apis"], "Rate-limited REST API pipeline", "case:npi"],
  ["Data governance & security", ["data governance", "governance", "row-level security", "row level security", "rls", "rbac", "access control"], "RLS and RBAC at NStarX and Populus", "case:agentra"],
  ["Data quality & validation", ["data quality", "data validation", "validation", "data integrity", "qa", "quality assurance", "testing"], "100% validated NPI records; QA testing", "case:npi"],
  ["HIPAA / healthcare data", ["hipaa", "healthcare", "phi", "pharma", "life science", "life sciences"], "HIPAA-compliant Looker analytics for 30+ clients at Populus Health", "case:looker-suite"],
  ["Google Analytics", ["google analytics", "ga4", "web analytics"], "GA4 data at Populus and NStarX", "case:looker-suite"],
  ["JavaScript / HTML / CSS", ["javascript", "html", "css", "node.js", "nodejs"], "100+ campaign test pages", "case:campaign-ops"],
  ["Git / GitHub", ["git", "github", "version control"], "Projects on GitHub", "#projects"],
  ["Agile", ["agile", "scrum", "jira", "sprint"], "Agile delivery at Populus", "#experience"],
  ["Stakeholder communication", ["stakeholder", "stakeholders", "requirements gathering", "business requirements", "communication", "documentation"], "Requirements and documentation; policy handbook", "#experience"],
  ["Financial / expense analytics", ["finance", "financial", "expense", "budget", "spend analysis", "fp&a"], "Agentra spend and budget analytics", "case:agentra"],
  ["Marketing / campaign analytics", ["marketing analytics", "campaign", "campaigns", "digital marketing", "media"], "Campaign setup with DoubleVerify, Crossix and IQVIA at Populus Health", "case:campaign-ops"]
];
/* Common job-ad skills not in Jaypreet's listed experience (shown honestly as gaps) */
var SKILLS_GAP = [
  ["Snowflake", ["snowflake(?! schema)"]], ["dbt", ["\\bdbt\\b"]], ["Airflow", ["airflow"]], ["Kafka", ["kafka"]],
  ["Scala", ["scala"]], ["Java", ["\\bjava\\b"]], ["Docker", ["docker"]], ["Kubernetes", ["kubernetes", "k8s"]],
  ["Terraform", ["terraform"]], ["Hadoop / Hive", ["hadoop", "hive"]], ["NoSQL / MongoDB", ["nosql", "mongodb", "cassandra", "dynamodb"]],
  ["PostgreSQL", ["postgres", "postgresql"]], ["Azure Data Factory", ["data factory", "\\badf\\b"]], ["Synapse", ["synapse"]],
  ["Fivetran", ["fivetran"]], ["Informatica", ["informatica"]], ["Talend", ["talend"]], ["SAS", ["\\bsas\\b"]],
  ["Deep learning", ["deep learning", "tensorflow", "pytorch", "keras", "neural network"]], ["NLP", ["\\bnlp\\b", "natural language processing"]],
  ["AWS Glue / EMR", ["\\bglue\\b", "\\bemr\\b"]], ["Kinesis", ["kinesis"]], ["CI/CD", ["ci/cd", "cicd", "continuous integration"]], ["Go", ["\\bgolang\\b"]]
];

function skillRegex(syn) { return new RegExp("(^|[^a-z0-9])(" + syn + ")(?=$|[^a-z0-9])", "i"); }
function findSkills(text) {
  var t = " " + text.toLowerCase() + " ";
  var have = SKILLS_HAVE.filter(function (s) { return s[1].some(function (x) { return skillRegex(x).test(t); }); });
  var gaps = SKILLS_GAP.filter(function (s) { return s[1].some(function (x) { return skillRegex(x).test(t); }); });
  return { have: have, gaps: gaps };
}
function evidenceLink(link, label) {
  if (link.indexOf("case:") === 0) return '<button type="button" class="ev-link" data-open="' + link.slice(5) + '">' + label + "</button>";
  return '<a class="ev-link" href="' + link + '">' + label + "</a>";
}
function escH(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

/* ---------- Toast ---------- */
function toast(msg) {
  var t = document.getElementById("toast");
  t.textContent = msg; t.classList.add("show");
  clearTimeout(toast._t); toast._t = setTimeout(function () { t.classList.remove("show"); }, 2600);
}
function goTo(view, targetId) {
  if (location.hash !== "#" + view) location.hash = view;
  if (targetId) setTimeout(function () {
    var el = document.getElementById(targetId);
    if (el) { el.scrollIntoView({ behavior: "instant", block: "start" }); var f = el.querySelector("textarea, input"); if (f) f.focus({ preventScroll: true }); }
  }, 160);
}
document.addEventListener("click", function (e) {
  var g = e.target.closest("[data-goto]");
  if (g) { e.preventDefault(); var p = g.getAttribute("data-goto").split("|"); goTo(p[0], p[1]); }
  var a = e.target.closest("[data-ask]");
  if (a) { e.preventDefault(); openChat(); }
});

/* =========================================================
   1. JOB-MATCH CHECKER
   ========================================================= */
(function () {
  var box = document.getElementById("fit-input"), out = document.getElementById("fit-result");
  if (!box) return;
  document.getElementById("fit-run").addEventListener("click", run);
  document.getElementById("fit-clear").addEventListener("click", function () { box.value = ""; out.innerHTML = ""; box.focus(); });
  function run() {
    var text = box.value.trim();
    if (text.length < 20) { out.innerHTML = '<p class="fit-note">Paste a job description (a few sentences or more) and click <b>Check my fit</b>.</p>'; return; }
    var r = findSkills(text), n = r.have.length + r.gaps.length;
    if (!n) { out.innerHTML = '<p class="fit-note">I couldn\'t find specific tools or skills in that text. Try pasting the full requirements section.</p>'; return; }
    var pct = Math.round(r.have.length / n * 100);
    var verdict = pct >= 80 ? "Strong match" : pct >= 60 ? "Good match" : pct >= 40 ? "Partial match" : "Some overlap";
    var html = '<div class="fit-score"><div class="ring-score" style="--p:' + pct + '"><b>' + pct + '%</b></div><div><h3>' + verdict + '</h3><p>' +
      r.have.length + " of " + n + " skills found in this job description are in my experience." + "</p></div></div>";
    html += '<div class="fit-cols"><div><h4>✓ Skills I bring (' + r.have.length + ')</h4><ul class="fit-list">' +
      r.have.map(function (s) { return '<li><b>' + s[0] + '</b><span>' + escH(s[2]) + " · " + evidenceLink(s[3], "See proof") + "</span></li>"; }).join("") + "</ul></div>";
    html += '<div><h4>○ Not yet in my experience (' + r.gaps.length + ')</h4>' + (r.gaps.length ?
      '<ul class="fit-list gaps">' + r.gaps.map(function (s) { return "<li><b>" + s[0] + "</b></li>"; }).join("") + "</ul><p class=\"fit-note\">Most of these have close equivalents in my stack (for example BigQuery/Redshift for Snowflake), and I pick up new tools quickly.</p>"
      : '<p class="fit-note">None. Everything listed matches my experience.</p>') + "</div></div>";
    html += '<div class="fit-cta"><a class="btn btn-primary" href="#contact">Discuss this role with me</a></div>';
    out.innerHTML = html;
  }
})();

/* =========================================================
   2. STARTUP PITCH: opens Contact with the message started for them
   ========================================================= */
document.addEventListener("click", function (e) {
  var b = e.target.closest("[data-pitch]");
  if (!b) return;
  var idea = b.getAttribute("data-pitch");
  goTo("contact");
  setTimeout(function () {
    var m = document.getElementById("cf-message");
    if (m) m.value = idea
      ? "Interested in: " + idea + "\n\nThe idea: \nStage (idea / prototype / customers): \nWhat you're looking for in a partner: "
      : "Startup idea: \n\nStage (idea / prototype / MVP): \nHow you'd like to work together: ";
    var n = document.getElementById("cf-name"); if (n) n.focus();
    toast(idea ? "Add a few details about your idea and send it." : "Tell me about your idea. It goes straight to my inbox.");
  }, 200);
});

/* =========================================================
   3. ASK-ME ASSISTANT (searches portfolio facts; never invents)
   ========================================================= */
var KB = [
  { w: 0.5, k: ["who", "about", "summary", "introduce", "yourself", "background", "overview", "jaypreet"], a: "Jaypreet is a <b>Data Engineer &amp; BI Analyst</b> with 5+ years building ETL pipelines, data models and dashboards. He's currently at <b>NStarX</b> (Agentra expense analytics), previously owned the Looker analytics suite at <b>Populus Health Technologies</b>, and holds a Master's in Business Analytics from the University of New Haven.", l: ["#about", "About him"] },
  { k: ["current", "currently", "work now", "working now", "job now", "nstarx", "agentra", "expense", "present", "latest"], a: "At <b>NStarX</b> (Jan 2026–present) he built the analytics suite for <b>Agentra</b>: a 12-table Power BI star schema, 25+ DAX measures, seven compliance checks and a fraud-risk score that flagged <b>$94K</b> in spend, plus a $61K (26%) budget overrun and $19K in vendor savings.", l: ["case:agentra", "Agentra case study"] },
  { k: ["populus", "healthcare", "health", "pharma", "hipaa", "life science", "clients", "customers"], a: "At <b>Populus Health Technologies</b> (2021–2024) he owned the Looker analytics suite for <b>30+ clients</b> with HIPAA-compliant handling, built LookML models with row-level security, engineered the <b>500K+ record</b> NPI pipeline, and ran technical setup for digital health campaigns with DoubleVerify, Crossix and IQVIA.", l: ["#experience", "Experience"] },
  { w: 0.8, k: ["intern", "internship", "benchmark", "platform evaluation", "tableau vs", "compare bi"], a: "As a Data Analyst Intern at NStarX (May–Aug 2025) he benchmarked <b>Tableau, Power BI, Domo and Qlik</b> for a client rollout, stress-tested them, built datasets from Redshift and GA4, and compared Domo's built-in ML forecasting with custom ARIMA models.", l: ["case:bi-benchmark", "Benchmark case study"] },
  { k: ["port authority", "panynj", "traffic", "toll", "congestion", "bridge", "tunnel", "bus", "passenger", "capstone"], a: "He did two Port Authority of NY &amp; NJ projects: a capstone showing traffic fell <b>12.7%</b> after 2025 congestion pricing (195.7M → 170.9M), with an ensemble model at R² 0.994, and bus terminal forecasts of about <b>188M</b> passengers for 2025–2030, with separate forecasts for 14 bus carriers.", l: ["case:pa-capstone", "Capstone case study"] },
  { k: ["education", "degree", "degrees", "master", "university", "college", "study", "studied", "bachelor", "graduate", "graduated", "school", "qualification", "qualifications"], a: "<b>Master's in Business Analytics</b> (Global Supply Chain Analytics concentration), University of New Haven, Aug 2024–Jan 2026. <b>B.E. in Electronics &amp; Communication Engineering</b>, RNS Institute of Technology, Bengaluru, 2016–2021.", l: ["#about", "Education"] },
  { k: ["certification", "certifications", "certificate", "certified", "course", "courses", "bootcamp"], a: "Certifications include <b>The AI Engineer Course 2026</b> (Udemy), <b>Data Analytics for Databricks</b> (Databricks Academy), The Ultimate MySQL Bootcamp, Advanced Google Analytics, R, and JSON with JavaScript.", l: ["#about", "Certifications"] },
  { k: ["location", "located", "live", "lives", "relocate", "relocation", "willing", "remote", "hybrid", "onsite", "on-site", "move", "based", "available", "availability"], a: "He's based in the <b>New York City area</b> and open to Data Engineer and BI Analyst roles <b>anywhere in the USA</b>: on-site, hybrid or remote.", l: ["#contact", "Contact him"] },
  { k: ["visa", "sponsorship", "sponsor", "work authorization", "authorization", "authorized", "authorised", "eligible", "eligibility", "citizen", "green card", "work permit", "opt", "h1b", "h-1b"], a: "Work-authorization details are best confirmed with Jaypreet directly. Email <b>s.jaypreet@gmail.com</b> and he'll reply quickly.", l: ["#contact", "Contact him"] },
  { k: ["salary", "compensation", "pay", "rate", "expected"], a: "Compensation is best discussed directly. Reach him at <b>s.jaypreet@gmail.com</b>.", l: ["#contact", "Contact him"] },
  { k: ["contact", "email", "reach", "hire", "interview", "call", "phone", "connect", "message"], a: "Email <b>s.jaypreet@gmail.com</b>, connect on LinkedIn (linkedin.com/in/jaypreet-singh), or use the message form on the Contact page.", l: ["#contact", "Contact page"] },
  { k: ["resume", "résumé", "cv"], a: "Use the <b>Résumé</b> button at the top right. There's a Data Engineer version and a Data Analyst version (PDF).", l: ["#home", "Home"] },
  { k: ["years", "experience", "experienced", "how long", "senior", "seniority", "level"], a: "<b>5+ years</b> across data engineering, BI and analytics: Populus Health (2021–2024) and NStarX (2025–present), plus graduate ML projects.", l: ["#experience", "Experience"] },
  { k: ["ai", "ml", "machine learning", "model", "models", "predict", "prediction", "forecast", "forecasting", "artificial intelligence"], a: "His ML work includes <b>Prophet, ARIMA/SARIMAX and XGBoost</b> forecasts to 2030, <b>Random Forest/XGBoost</b> classification for toll violations, <b>Azure AutoML</b> model selection, and an <b>SVM</b> cancer classifier at 98% accuracy. He also completed an AI Engineer bootcamp and uses LLM tools.", l: ["#home", "AI & ML section"] },
  { k: ["etl", "pipeline", "pipelines", "data engineering", "ingestion", "npi", "api"], a: "His flagship pipeline pulls <b>500K+ provider records</b> from the NPI Registry API in Python, with rate-limit throttling, checkpoint restarts, fail-safe logging and 100% validation. He's also automated ETL across MySQL, BigQuery and GA4.", l: ["case:npi", "NPI pipeline case study"] },
  { k: ["dashboard", "dashboards", "bi", "power bi", "looker", "tableau", "visualization", "reporting", "dax", "lookml"], a: "He builds governed dashboards in <b>Power BI</b> (DAX, RLS/RBAC) and <b>Looker</b> (LookML), and has worked with Looker Studio, Tableau, Qlik, Domo and QuickSight. Highlights: Agentra in Power BI and the Looker suite for 30+ clients.", l: ["case:looker-suite", "Looker case study"] },
  { k: ["cloud", "aws", "gcp", "azure", "databricks", "spark", "redshift", "bigquery"], a: "Cloud experience: <b>AWS</b> (Redshift, S3, Lambda), <b>GCP</b> (BigQuery, Vertex AI, GA4), <b>Azure</b> AutoML, plus Databricks and Apache Spark.", l: ["#skills", "Skills"] },
  { k: ["campaign", "campaigns", "marketing", "doubleverify", "crossix", "iqvia", "test pages", "creative"], a: "At Populus he set up digital health campaign creatives, integrated <b>DoubleVerify, Crossix and IQVIA</b>, and built <b>100+ test pages</b> for client QA.", l: ["case:campaign-ops", "Campaign case study"] },
  { k: ["github", "code", "repo", "repository", "projects", "portfolio", "work samples"], a: "Code is on GitHub at <b>github.com/jaypreet-singh</b>, including both Port Authority projects, Power BI work, the SVM classifier and the LabVIEW test procedure.", l: ["#projects", "All projects"] },
  { k: ["strength", "strengths", "why hire", "why should", "unique", "best", "good at", "stand out"], a: "He covers the whole path from <b>raw source to decision</b>: resilient pipelines, clean star-schema models, governed dashboards and ML forecasts, with measurable results like $94K in flagged spend and 100% validated pipelines.", l: ["#projects", "See the work"] },
  { k: ["startup", "startups", "co-founder", "cofounder", "co founder", "co-founding", "cofounding", "co-found", "entrepreneur", "founder", "founding", "collaborate", "collaboration", "partner", "partnership", "idea", "ideas", "venture", "build together", "side project", "advisor", "product idea", "product ideas", "copilot", "mvp", "prototype", "with me", "together", "join us", "our team"], a: "Yes! Jaypreet is <b>open to startup collaboration in the US</b>. If you already have an idea, he can step in as the technical partner to build it; he's also open to <b>co-founding</b> a new tech product from scratch, or joining early as a <b>founding engineer</b> or <b>advisor</b>. Any industry, any stage. Pitch your idea through the Contact form or at <b>s.jaypreet@gmail.com</b>.", l: ["#home|startup", "See startup collaboration"] },
  { k: ["fit", "match", "job description", "jd", "suitable", "qualified", "requirements"], a: "Paste your job description into the <b>Job-match checker</b> on the Skills page. It scores the fit and links proof for each skill.", l: ["#skills|fit", "Open job-match checker"] },
  { k: ["breast", "cancer", "svm", "medical"], a: "His B.E. final-year project built a <b>Support Vector Machine</b> that classifies breast cells as benign or malignant from 30 features, at 98% accuracy.", l: ["case:breast-cancer", "Case study"] },
  { k: ["labview", "vi solutions", "tata", "iot", "hardware", "electronics", "sensor"], a: "Before data, he interned at <b>VI Solutions</b> (automated hardware testing in LabVIEW) and <b>Tata Steel</b> (real-time water-quality sensors streaming to the cloud).", l: ["#experience", "Experience"] }
];
var STOP = "a an the is are was were be been do does did he his him singh has have had what which whom how can could would will you your with for of to in on at by and or any some tell me please there this that it its i we our".split(" ");

function answer(q) {
  var t = " " + q.toLowerCase().replace(/[’']s\b/g, "s").replace(/[’']/g, "").replace(/[?!.,;:()]/g, " ").replace(/\s+/g, " ") + " ";
  var words = t.split(/\s+/).filter(function (w) { return w && STOP.indexOf(w) === -1; });
  function hasWord(k) { return words.indexOf(k) > -1 || words.indexOf(k + "s") > -1 || (k.length > 3 && /s$/.test(k) && words.indexOf(k.slice(0, -1)) > -1); }
  var best = null, bestScore = 0;
  KB.forEach(function (e) {
    var s = 0;
    e.k.forEach(function (k) { if (k.indexOf(" ") > -1 ? t.indexOf(k) > -1 : hasWord(k)) s += (k.indexOf(" ") > -1 ? 2 : 1) * (e.w || 1); });
    if (s > bestScore) { bestScore = s; best = e; }
  });
  var skills = findSkills(q);
  var yesNo = /^\s*(does|do|has|have|had|did|can|could|is|are|any|experience|exp|know|knows|familiar|proficient|worked|used)\b/i.test(q);
  var skillFirst = (skills.have.length || skills.gaps.length) && (yesNo || bestScore === 0);
  if (skillFirst) {
    var parts = [];
    if (skills.have.length) parts.push("<b>Yes:</b><ul>" + skills.have.slice(0, 5).map(function (s) { return "<li><b>" + s[0] + "</b>: " + escH(s[2]) + " · " + evidenceLink(s[3], "proof") + "</li>"; }).join("") + "</ul>");
    if (skills.gaps.length) parts.push("<b>Not in his listed experience:</b> " + skills.gaps.map(function (s) { return s[0]; }).join(", ") + ". He works with close equivalents and learns new tools quickly.");
    return { a: parts.join(""), l: null, conf: yesNo ? "skill" : "weak" };
  }
  if (best && bestScore > 0) return { a: best.a, l: best.l, conf: bestScore >= 1 ? "kb" : "weak" };
  return { conf: "none", a: "I don't have that detail. I only answer from Jaypreet's portfolio, so I won't guess. Try asking about his experience, projects, skills or education, or email him at <b>s.jaypreet@gmail.com</b>.", l: ["#contact", "Contact him"] };
}

var chat = document.getElementById("chat"), chatLog = document.getElementById("chat-log"), chatInput = document.getElementById("chat-input");
function linkHTML(l) {
  if (!l) return "";
  if (l[0].indexOf("case:") === 0) return '<button type="button" class="ev-link" data-open="' + l[0].slice(5) + '">' + l[1] + " →</button>";
  if (l[0].indexOf("|") > -1) return '<button type="button" class="ev-link" data-goto="' + l[0].slice(1) + '">' + l[1] + " →</button>";
  return '<a class="ev-link" href="' + l[0] + '">' + l[1] + " →</a>";
}
function addMsg(who, html) {
  var d = document.createElement("div"); d.className = "msg " + who; d.innerHTML = html;
  chatLog.appendChild(d); chatLog.scrollTop = chatLog.scrollHeight;
}
/* Optional free AI: set SITE.aiEndpoint (js/main.js) to your Cloudflare Worker URL.
   Portfolio questions are answered instantly from the built-in answers; anything else goes to the AI. */
var chatHistory = [];
function fmtAI(text) {
  // Light Markdown: paragraphs, "- " / "* " / "1." lists, **bold**, `code`.
  var inline = function (t) { return escH(t).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/`([^`]+)`/g, "<code>$1</code>"); };
  var out = [], list = null;
  text.replace(/\r/g, "").split("\n").forEach(function (line) {
    var m = line.match(/^\s*(?:[-*•]|\d+[.)])\s+(.*)$/);
    if (m) { if (!list) { list = []; } list.push("<li>" + inline(m[1]) + "</li>"); return; }
    if (list) { out.push("<ul>" + list.join("") + "</ul>"); list = null; }
    if (line.trim()) out.push("<p>" + inline(line.trim()) + "</p>");
  });
  if (list) out.push("<ul>" + list.join("") + "</ul>");
  return out.join("");
}
function askAI(q) {
  var ctrl = typeof AbortController !== "undefined" ? new AbortController() : null;
  var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 25000);
  return fetch(SITE.aiEndpoint, {
    method: "POST", headers: { "Content-Type": "application/json" }, signal: ctrl ? ctrl.signal : undefined,
    body: JSON.stringify({ question: q, history: chatHistory.slice(-6) })
  }).then(function (r) { clearTimeout(timer); if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
    .then(function (d) { if (!d || !d.answer) throw new Error("empty"); return d.answer; });
}
var busy = false;
function ask(q) {
  q = q.trim(); if (!q || busy) return;
  busy = true; chatInput.disabled = true;
  addMsg("me", escH(q)); chatInput.value = "";
  var r = answer(q);
  var typing = document.createElement("div"); typing.className = "msg bot typing"; typing.innerHTML = "<i></i><i></i><i></i>"; chatLog.appendChild(typing); chatLog.scrollTop = chatLog.scrollHeight;
  function done(html) { typing.remove(); addMsg("bot", html); busy = false; chatInput.disabled = false; chatInput.focus(); }
  // Open-ended questions get a real AI answer; quick factual lookups stay instant.
  var openEnded = /\b(how|why|would|could|should|explain|describe|compare|comparison|difference|approach|handle|what is|what are|what's|walk me|example|examples|best way|tell me more|elaborate|summari[sz]e|think|advice|suggest|improve|design|optimi[sz]e|troubleshoot|fix|vs|versus)\b/i.test(q);
  var useAI = SITE.aiEndpoint && (r.conf === "none" || r.conf === "weak" || openEnded);
  if (!useAI) {
    setTimeout(function () { done(r.a + (r.l ? "<div>" + linkHTML(r.l) + "</div>" : "")); }, 450);
    chatHistory.push({ role: "user", text: q }, { role: "model", text: r.a.replace(/<[^>]+>/g, "") });
    return;
  }
  askAI(q).then(function (text) {
    chatHistory.push({ role: "user", text: q }, { role: "model", text: text });
    done(fmtAI(text) + '<div class="ai-tag">AI answer · may be imperfect, email Jaypreet to confirm</div>');
  }).catch(function () { done(r.a + (r.l ? "<div>" + linkHTML(r.l) + "</div>" : "")); });
}
function openChat() { chat.classList.add("open"); document.getElementById("chat-fab").setAttribute("aria-expanded", "true"); setTimeout(function () { chatInput.focus(); }, 50); }
function closeChat() { chat.classList.remove("open"); document.getElementById("chat-fab").setAttribute("aria-expanded", "false"); }
(function () {
  if (!chat) return;
  addMsg("bot", "Hi! I'm Jaypreet's portfolio assistant. Ask me about his experience, projects, skills or availability. I answer only from his portfolio.");
  document.getElementById("chat-fab").addEventListener("click", function () { chat.classList.contains("open") ? closeChat() : openChat(); });
  document.getElementById("chat-close").addEventListener("click", closeChat);
  document.getElementById("chat-form").addEventListener("submit", function (e) { e.preventDefault(); ask(chatInput.value); });
  document.querySelectorAll(".chat-sugg button").forEach(function (b) { b.addEventListener("click", function () { ask(b.textContent); }); });
  chatLog.addEventListener("click", function (e) { if (e.target.closest("a[href^='#'], [data-goto]")) { if (window.innerWidth < 640) closeChat(); } });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && chat.classList.contains("open") && !document.querySelector("dialog[open]")) closeChat(); });
})();

/* =========================================================
   4. CMD+K SEARCH
   ========================================================= */
(function () {
  var dlg = document.getElementById("cmdk"), input = document.getElementById("cmdk-input"), list = document.getElementById("cmdk-list");
  if (!dlg) return;
  var items = [
    ["Home", "Page", function () { location.hash = "home"; }], ["About", "Page", function () { location.hash = "about"; }],
    ["Experience", "Page", function () { location.hash = "experience"; }], ["Projects", "Page", function () { location.hash = "projects"; }],
    ["Skills", "Page", function () { location.hash = "skills"; }], ["Contact", "Page", function () { location.hash = "contact"; }],
    ["Job-match checker", "Tool", function () { goTo("skills", "fit"); }], ["Startup collaboration", "Section", function () { goTo("home", "startup"); }],
    ["Ask the assistant", "Tool", function () { openChat(); }],
    ["Data Engineer résumé (PDF)", "Download", function () { window.open("assets/Jaypreet_Singh_Data_Engineer_Resume.pdf", "_blank", "noopener"); }],
    ["Data Analyst résumé (PDF)", "Download", function () { window.open("assets/Jaypreet_Singh_Data_Analyst_Resume.pdf", "_blank", "noopener"); }],
    ["Copy email address", "Action", function () { try { navigator.clipboard.writeText(SITE.email).then(function () { toast("Email copied: " + SITE.email); }, function () { toast(SITE.email); }); } catch (e) { toast(SITE.email); } }],
    ["Switch light / dark theme", "Action", function () { document.getElementById("theme-toggle").click(); }],
    ["LinkedIn profile", "Link", function () { window.open(SITE.linkedin, "_blank", "noopener"); }],
    ["GitHub profile", "Link", function () { window.open(SITE.github, "_blank", "noopener"); }]
  ].concat(PROJECTS.filter(function (p) { return p.detail; }).map(function (p) {
    return [p.title, "Project", function () { if (location.hash !== "#projects") location.hash = "projects"; setTimeout(function () { window.openCase(p.id); }, 120); }];
  }));
  var shown = [], sel = 0;
  function render() {
    var q = input.value.trim().toLowerCase();
    shown = items.filter(function (it) { return !q || (it[0] + " " + it[1]).toLowerCase().indexOf(q) > -1 || q.split(/\s+/).every(function (w) { return (it[0] + " " + it[1]).toLowerCase().indexOf(w) > -1; }); });
    sel = Math.min(sel, Math.max(shown.length - 1, 0));
    list.innerHTML = shown.length ? shown.map(function (it, i) {
      return '<li role="option" id="ck-' + i + '" aria-selected="' + (i === sel) + '" data-i="' + i + '"><span>' + escH(it[0]) + "</span><small>" + it[1] + "</small></li>";
    }).join("") : '<li class="empty">No results. Try “Power BI”, “résumé” or “contact”.</li>';
    input.setAttribute("aria-activedescendant", shown.length ? "ck-" + sel : "");
    var a = list.querySelector('[aria-selected="true"]'); if (a) a.scrollIntoView({ block: "nearest" });
  }
  function run(i) { var it = shown[i]; if (!it) return; dlg.close(); it[2](); }
  function open() { input.value = ""; sel = 0; render(); dlg.showModal(); input.focus(); }
  var openBtn = document.getElementById("cmdk-open"); if (openBtn) openBtn.addEventListener("click", open);
  document.addEventListener("keydown", function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); dlg.open ? dlg.close() : open(); }
  });
  input.addEventListener("input", function () { sel = 0; render(); });
  input.addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown") { e.preventDefault(); sel = Math.min(sel + 1, shown.length - 1); render(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); sel = Math.max(sel - 1, 0); render(); }
    else if (e.key === "Enter") { e.preventDefault(); run(sel); }
  });
  list.addEventListener("click", function (e) { var li = e.target.closest("li[data-i]"); if (li) run(+li.getAttribute("data-i")); });
  dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
})();
