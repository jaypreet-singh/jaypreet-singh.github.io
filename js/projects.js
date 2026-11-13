/* =========================================================
   PROJECTS — edit this list to add or change projects.
   cat: any of "eng", "bi", "ml", "hw"
   logo: one of the keys in LOGOS
   repo: GitHub link, or "" to hide the button
   ========================================================= */
var PROJECTS = [
  {
    id: "agentra",
    featured: true,
    cat: ["bi", "eng"],
    logo: "nstarx",
    org: "NStarX Inc. · Production",
    when: "2026",
    title: "Agentra: expense analytics & compliance engine",
    summary: "The analytics layer for NStarX's expense management product: a 12-table star schema, 25+ DAX measures and a rules engine that turns the employee handbook into automated compliance checks.",
    metrics: [["$94K", "spend flagged for review"], ["$61K (26%)", "budget overrun surfaced"], ["$19K", "vendor savings identified"], ["1,700+", "transactions modeled"]],
    chips: ["Power BI", "DAX", "Star schema", "RLS / RBAC", "Rules engine"],
    repo: "",
    detail: {
      role: "Data Engineer: designed and built the data model, measures, rules engine and dashboards",
      context: "Agentra needed an analytics layer that gives finance one trusted view of company spend and catches expense-policy violations automatically.",
      data: [
        "12-table star schema covering departments, vendors, projects and employees",
        "1,700+ expense transactions and 400+ reimbursement vouchers",
        "Policy limits from the employee handbook and IRS mileage guidelines, stored in a governed dimension table"
      ],
      approach: [
        "Designed a scalable model that centralizes policy data, isolates seven independent compliance checks and uses fixed-size lookup tables for fast queries",
        "Wrote 25+ DAX measures, from spend and budget roll-ups to a RANKX-based spend-concentration curve and SWITCH measures over a disconnected lookup table",
        "Built a rules-based validation engine and a composite fraud-risk score, using statistical thresholds, that catches missing receipts, late-booked travel, policy overages and duplicate submissions",
        "Kept policy limits as data, not hardcoded in formulas, so finance can change rules without touching DAX",
        "Implemented department-level Row-Level Security, with Power BI workspace RBAC (Viewer / Contributor / Admin) on top",
        "Authored the accompanying Travel & Expense Policy Handbook"
      ],
      results: [
        "Flagged over $94K of spend for review",
        "Variance analysis surfaced a $61K (26%) budget overrun in one department",
        "Concentration analysis found a $19K saving from consolidating spend with preferred vendors"
      ]
    }
  },
  {
    id: "npi",
    cat: ["eng"],
    logo: "populus",
    org: "Populus Health Technologies",
    when: "2021–2024",
    title: "Resilient NPI Registry ETL pipeline",
    summary: "A high-throughput Python pipeline that pulls provider records from the public NPI Registry API and lands them clean, complete and auditable.",
    metrics: [["500K+", "provider records ingested"], ["100%", "records passed validation"]],
    chips: ["Python", "REST API", "AWS Lambda", "ETL", "Logging"],
    repo: "",
    detail: {
      role: "Data Engineer",
      context: "Healthcare marketing analytics depend on accurate provider data. Pulling it from a rate-limited public API at scale needed to survive failures without losing or duplicating records.",
      data: ["Public NPI Registry API (U.S. healthcare provider identifiers)", "500K+ provider records"],
      approach: [
        "Automated API rate-limit throttling to stay within the registry's limits",
        "Checkpoint-based restarts so a failed run resumes where it stopped",
        "Fail-safe logging and built-in validation on every batch",
        "Automated data collection and storage with Python and AWS Lambda"
      ],
      results: ["100% data integrity and validation across 500K+ records", "Long runs restart from the last checkpoint instead of starting over"]
    }
  },
  {
    id: "pa-capstone",
    cat: ["ml", "bi"],
    logo: "panynj",
    org: "Port Authority of NY & NJ · UNH Capstone",
    when: "Aug–Dec 2025",
    title: "Bridge & tunnel traffic, toll violations and 2025 congestion pricing",
    summary: "Five-goal capstone for the Port Authority: what drives traffic, where toll violations happen, the busiest times, how 2025 congestion pricing shifted drivers, and forecasts to 2030.",
    metrics: [["−12.7%", "traffic after 2025 pricing (195.7M → 170.9M)"], ["5.7M", "toll violations in 2025"], ["R² 0.994", "busiest-times model accuracy"]],
    chips: ["Python", "Azure AutoML", "XGBoost", "LightGBM", "Prophet", "SARIMAX", "Looker Studio"],
    repo: "https://github.com/jaypreet-singh/Port-Authority-NY-NJ-Bus-terminal-Project-2",
    detail: {
      role: "Led data integration and automation, wrote the forecasting scripts, ran the Azure AutoML models and built the Looker Studio dashboard",
      team: "Team of 5 · BANL 6900 Business Analytics Capstone, University of New Haven",
      context: "The Port Authority runs bridges, tunnels and the bus terminal used by millions. It wanted to improve traffic flow, reduce congestion, optimize toll operations and understand the impact of 2025 toll changes.",
      data: [
        "Port Authority traffic records for 8 facilities (about 90K–110K rows each), split by facility to stay inside CSV limits",
        "Weather (5,263 daily records: precipitation, snow, temperature, wind), U.S. holidays and 2025 toll prices",
        "11 CSV files joined on date, with Python loops automating load, clean and merge for every facility"
      ],
      approach: [
        "Cleaned and validated data in pandas: de-duplication, date and time standardization, forward-fill and monthly-mean imputation, date-continuity checks",
        "Built one goal-specific dataset and script per question to keep the data manageable",
        "Azure AutoML: ElasticNet for usage drivers, Random Forest (cross-checked with XGBoost) for violation risk, a Voting Ensemble of XGBoost + LightGBM for busiest times (R² 0.994), and ARIMAX for time-series forecasting",
        "Replicated AutoML results in Python with scikit-learn, Prophet and SARIMAX",
        "Built the final Looker Studio dashboard for peak periods, seasonality and violations"
      ],
      results: [
        "After 2025 congestion pricing, total traffic fell from 195.7M (2024) to 170.9M (2025). Drivers shifted from Lincoln, Holland and GWB Lower to cheaper crossings like Goethals and Outerbridge.",
        "5.7M toll violations in 2025, with monthly violation rates of 3.5%–4.7%, peaking in May at about 390K",
        "July is the busiest month (13.9M vehicles) and February the slowest; Thursdays and Fridays are the busiest days",
        "Forecasts show steady growth through 2030, with GWB Upper, GWB Lower and Goethals remaining the busiest facilities",
        "Recommended EZPass-only peak lanes, more ALPR cameras at high-violation sites, seasonal staffing and a real-time operations dashboard"
      ]
    }
  },
  {
    id: "pa-forecast",
    cat: ["ml", "bi"],
    logo: "panynj",
    org: "Port Authority of NY & NJ · UNH",
    when: "Feb–May 2025",
    title: "Bus terminal passenger forecasting 2025–2030",
    summary: "Forecasts of passengers per terminal and per bus carrier to size the Port Authority's temporary staging facilities, plus bridge traffic and post-COVID recovery.",
    metrics: [["188M", "bus passengers forecast, 2025–2030"], ["14", "bus carriers forecast individually"], ["2005–2024", "monthly training history"]],
    chips: ["SQL", "MS Access", "Python", "Prophet", "XGBoost", "K-Means", "Random Forest", "Power BI"],
    repo: "https://github.com/jaypreet-singh/Port-Authority-NY-NJ-Bus-terminal-Project-1",
    detail: {
      role: "Built the terminal forecasts (Prophet) and the per-carrier forecasts (XGBoost), plus the clustering and classification models",
      team: "Team of 5 · BANL 6430 Database Management for Business Analytics, University of New Haven",
      context: "The Port Authority is building temporary staging facilities and needed to know how many people will use them, which carriers drive demand, and when the peaks will be.",
      data: [
        "Three Microsoft Access databases: TBT Traffic (8 datasets, 43 queries, 34 reports), Unit 571 bus departures, and weather",
        "Monthly passenger counts from 2005 to 2024 for the Midtown Bus Terminal, George Washington Bridge Bus Station and more",
        "Date, carrier and facility joins (left joins to keep every passenger record)"
      ],
      approach: [
        "Prophet model per terminal to forecast monthly passengers from January 2025 to December 2030",
        "XGBoost model per carrier with weather features, tuned with GridSearchCV and time-series cross-validation",
        "K-Means to group carriers and facilities with similar demand patterns for shared scheduling",
        "Random Forest to flag high-traffic months (top 25%) for staffing",
        "Power BI dashboard comparing 2025–2030 projections and 2019 vs 2025 usage"
      ],
      results: [
        "Midtown Bus Terminal: about 180M passengers over 2025–2030, above 2.9M a month in July and August",
        "GWB Bus Station: about 8M passengers over the same period; about 188M combined",
        "NJ Transit, Greyhound and Hudson Transit lead, with 16–18M passengers each",
        "George Washington Bridge forecast at 403.8M vehicles for 2025–2030, with summer peaks",
        "GWB and Bayonne traffic is now above 2019 levels, while Holland Tunnel still lags"
      ]
    }
  },
  {
    id: "bi-benchmark",
    cat: ["bi", "ml"],
    logo: "nstarx",
    org: "NStarX Inc. · Internship",
    when: "May–Aug 2025",
    title: "Enterprise BI platform benchmark",
    summary: "A scored evaluation of four BI platforms for a client's enterprise-wide rollout, including stress tests and a live-data prototype on Amazon Redshift.",
    metrics: [["4", "BI platforms benchmarked"], ["4", "scoring criteria"]],
    chips: ["Amazon Redshift", "GA4", "Tableau", "Power BI", "Domo", "Qlik", "ML forecasting", "ARIMA"],
    repo: "",
    detail: {
      role: "Data Analyst Intern",
      context: "A client needed one BI platform for embedded, white-labeled analytics across the enterprise.",
      data: ["Amazon Redshift and Google Analytics data, shaped into custom reporting datasets"],
      approach: [
        "Scored the platforms on scalability, security, portability and white-labeling",
        "Simulated high-concurrency workloads to stress-test performance",
        "Benchmarked Domo's built-in AI/ML forecasting against custom Python ARIMA models on accuracy across key metrics",
        "Prototyped migrating datasets and dashboards from QuickSight and Looker to the chosen platform"
      ],
      results: ["Delivered a recommendation and a working dashboard prototype on live data"]
    }
  },
  {
    id: "powerbi",
    cat: ["bi"],
    logo: "unh",
    org: "University of New Haven",
    when: "Sep–Dec 2024",
    title: "Power BI reporting & dashboard development",
    summary: "Interactive, business-ready Power BI reports on a star-schema model that blends SQL, Excel and cloud sources.",
    metrics: [],
    chips: ["Power BI", "DAX", "Power Query", "SQL", "Excel"],
    repo: "https://github.com/jaypreet-singh/PowerBI-Projects",
    detail: {
      role: "Developer",
      context: "Coursework on building governed, decision-ready reports.",
      data: ["SQL, Excel and cloud sources"],
      approach: ["Star-schema modeling for accurate drill-downs", "Complex DAX measures and advanced filters"],
      results: ["Interactive reports ready for business users"]
    }
  },
  {
    id: "breast-cancer",
    cat: ["ml"],
    logo: "rnsit",
    org: "RNSIT · B.E. final-year project",
    when: "2021",
    title: "Breast cancer detection with SVM",
    summary: "A Support Vector Machine that classifies breast cells as benign or malignant from 30 measured attributes, with live predictions for new patient data.",
    metrics: [["98%", "classification accuracy"], ["30", "features per sample"]],
    chips: ["Python", "Scikit-learn", "SVM", "Pandas", "Matplotlib", "Seaborn"],
    repo: "https://github.com/jaypreet-singh/Breast-Cancer-Detection",
    detail: {
      role: "Co-developer (team of 2) · B.E. thesis, Visvesvaraya Technological University",
      context: "Early detection improves survival. Machine learning can give fast, repeatable predictions that support doctors' scans and biopsies.",
      data: ["Breast cell measurements from microscopic images, with 30 attributes per sample"],
      approach: [
        "Pre-processed and explored the data with Pandas, Matplotlib and Seaborn to find the most predictive features",
        "Trained a Support Vector Machine classifier and evaluated it on held-out data",
        "Added input for new patient data to return a benign or malignant result in real time"
      ],
      results: ["98% accuracy after the final pre-processing pass"]
    }
  },
  {
    id: "labview",
    cat: ["hw"],
    logo: "visol",
    org: "VI Solutions, Bengaluru · Internship",
    when: "Jul–Aug 2020",
    title: "Automatic Test Procedure (ATP) in LabVIEW",
    summary: "An automated hardware test that reads input voltage through NI DAQ hardware, runs the error analysis and generates the test report automatically.",
    metrics: [],
    chips: ["LabVIEW", "NI-DAQmx", "NI myDAQ", "Automation"],
    repo: "https://github.com/jaypreet-singh/ATP-LabVIEW",
    detail: {
      role: "Intern · guided by a Senior Application Engineer",
      context: "VI Solutions builds test, measurement and automation systems for defense, aerospace and education. Manual hardware tests were slow and error-prone.",
      data: ["Analog input and output signals captured with NI DAQmx and NI myDAQ"],
      approach: [
        "Built the LabVIEW block diagram and front panel for the test",
        "Calculated error and percentage deviation in an event structure",
        "Automated report creation with date, time, tester name and results"
      ],
      results: ["One-click accuracy testing of a source voltage, with a saved report for every run"]
    }
  },
  {
    id: "tata",
    cat: ["hw"],
    logo: "tata",
    org: "Tata Steel, Jamshedpur · Internship",
    when: "May–Aug 2019",
    title: "Real-time water quality monitoring (IoT)",
    summary: "Measured water temperature and dissolved oxygen with sensors and streamed the readings to the Adafruit IO cloud in real time.",
    metrics: [],
    chips: ["IoT", "Sensors", "Adafruit IO", "Real-time data"],
    repo: "",
    detail: null
  }
];
