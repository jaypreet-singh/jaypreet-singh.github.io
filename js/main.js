/* ===== Your links — edit here ===== */
var SITE = {
  email: "s.jaypreet@gmail.com",
  linkedin: "https://www.linkedin.com/in/jaypreet-singh/",
  github: "https://github.com/jaypreet-singh"
};

/* Organization logos */
var LOGOS = {
  nstarx:  { name: "NStarX", src: "assets/logos/nstarx.png" },
  populus: { name: "Populus Health Technologies", src: "assets/logos/populus-health.png" },
  panynj:  { name: "Port Authority of NY & NJ", src: "assets/logos/port-authority.png" },
  visol:   { name: "VI Solutions", src: "assets/logos/vi-solutions.png" },
  unh:     { name: "University of New Haven", src: "assets/logos/university-of-new-haven.png" },
  rnsit:   { name: "RNS Institute of Technology", src: "assets/logos/rnsit.png" },
  tata:    { name: "Tata Steel", src: "assets/logos/tata-steel.png" }
};

function logoHTML(key, small) {
  var l = LOGOS[key]; if (!l) return "";
  var cls = "logo" + (small ? " sm" : "") + (l.mono ? " mono " + l.cls : "");
  return '<span class="' + cls + '" title="' + esc(l.name) + '">' + (l.mono ? '<span aria-hidden="true">' + l.mono + "</span>" : '<img src="' + l.src + '" alt="' + esc(l.name) + ' logo">') + "</span>";
}
function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

var ICON_GH = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.62 1.58.23 2.75.11 3.04.74.8 1.18 1.83 1.18 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5z"/></svg>';
var ICON_OPEN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 12h16M14 6l6 6-6 6"/></svg>';

/* ----- Theme (dark by default, remembers the visitor's choice) ----- */
(function () {
  var root = document.documentElement;
  var btn = document.getElementById("theme-toggle");
  function set(t) {
    root.setAttribute("data-theme", t);
    btn.setAttribute("aria-label", t === "dark" ? "Switch to light theme" : "Switch to dark theme");
    try { localStorage.setItem("theme", t); } catch (e) {}
  }
  btn.addEventListener("click", function () { set(root.getAttribute("data-theme") === "dark" ? "light" : "dark"); });
  set(root.getAttribute("data-theme") || "dark");
})();

/* ----- Projects: cards + case-study dialog ----- */
(function () {
  var grid = document.getElementById("project-grid");
  var home = document.getElementById("home-projects");
  function card(p, compact) {
    var m = (p.metrics || []).map(function (x) { return "<div><b>" + esc(x[0]) + "</b>" + esc(x[1]) + "</div>"; }).join("");
    var actions = "";
    if (p.detail) actions += '<button class="link-btn" type="button" data-open="' + p.id + '">Read case study ' + ICON_OPEN + "</button>";
    if (p.repo) actions += '<a class="link-btn" href="' + p.repo + '" target="_blank" rel="noopener">' + ICON_GH + " Code</a>";
    return '<article class="card card-hover proj' + (p.featured && !compact ? " featured" : "") + '" data-k="' + p.cat.join(" ") + '">' +
      '<div class="top">' + logoHTML(p.logo, true) + '<div class="org-line"><b>' + esc(p.when) + "</b>" + esc(p.org) + "</div></div>" +
      "<h3>" + esc(p.title) + "</h3><p>" + esc(p.summary) + "</p>" +
      (m ? '<div class="metric">' + m + "</div>" : "") +
      '<ul class="chips">' + p.chips.map(function (c) { return "<li>" + esc(c) + "</li>"; }).join("") + "</ul>" +
      (actions ? '<div class="actions">' + actions + "</div>" : "") + "</article>";
  }
  grid.innerHTML = PROJECTS.map(function (p) { return card(p, false); }).join("");
  home.innerHTML = PROJECTS.filter(function (p) { return ["agentra", "looker-suite", "pa-capstone"].indexOf(p.id) !== -1; })
    .map(function (p) { return card(p, true); }).join("");

  // filter counts
  document.querySelectorAll(".filter").forEach(function (b) {
    var f = b.getAttribute("data-f");
    var n = f === "all" ? PROJECTS.length : PROJECTS.filter(function (p) { return p.cat.indexOf(f) !== -1; }).length;
    b.insertAdjacentHTML("beforeend", '<span class="count">' + n + "</span>");
    b.addEventListener("click", function () {
      document.querySelectorAll(".filter").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
      grid.querySelectorAll(".proj").forEach(function (c) {
        c.hidden = !(f === "all" || c.getAttribute("data-k").split(" ").indexOf(f) !== -1);
      });
    });
  });

  var dlg = document.getElementById("case");
  function list(arr) { return "<ul>" + arr.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>"; }
  function open(id) {
    var p = PROJECTS.filter(function (x) { return x.id === id; })[0];
    if (!p || !p.detail) return;
    var d = p.detail;
    document.getElementById("case-logo").innerHTML = logoHTML(p.logo);
    document.getElementById("case-title").textContent = p.title;
    document.getElementById("case-org").textContent = p.org + " · " + p.when;
    var stats = (p.metrics || []).map(function (x) { return "<div><b>" + esc(x[0]) + "</b>" + esc(x[1]) + "</div>"; }).join("");
    document.getElementById("case-body").innerHTML =
      (stats ? '<div class="case-stats">' + stats + "</div>" : "") +
      '<div class="case-meta"><span><b>My role:</b> ' + esc(d.role) + "</span>" + (d.team ? "<span><b>Team:</b> " + esc(d.team) + "</span>" : "") + "</div>" +
      "<section><h3>The problem</h3><p>" + esc(d.context) + "</p></section>" +
      "<section><h3>Data</h3>" + list(d.data) + "</section>" +
      "<section><h3>" + (d.team ? "Team approach &amp; my part" : "What I built") + "</h3>" + list(d.approach) + "</section>" +
      "<section><h3>Results &amp; impact</h3>" + list(d.results) + "</section>" +
      '<ul class="chips">' + p.chips.map(function (c) { return "<li>" + esc(c) + "</li>"; }).join("") + "</ul>" +
      (p.repo ? '<div><a class="btn btn-primary" href="' + p.repo + '" target="_blank" rel="noopener">' + ICON_GH + " View code on GitHub</a></div>" : "");
    if (typeof dlg.showModal === "function") dlg.showModal(); else dlg.setAttribute("open", "");
    dlg.scrollTop = 0;
  }
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-open]");
    if (t) open(t.getAttribute("data-open"));
  });
  document.getElementById("case-close").addEventListener("click", function () { dlg.close(); });
  dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
})();

/* ----- Tabs (hash routing) ----- */
(function () {
  var views = Array.prototype.slice.call(document.querySelectorAll(".view"));
  var names = views.map(function (v) { return v.getAttribute("data-view"); });
  var tabs = document.getElementById("tabs");
  var toggle = document.getElementById("menu-toggle");
  function show(name) {
    if (names.indexOf(name) === -1) name = "home";
    views.forEach(function (v) { v.classList.toggle("active", v.getAttribute("data-view") === name); });
    document.querySelectorAll(".tabs a").forEach(function (a) {
      if (a.getAttribute("href") === "#" + name) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    var label = document.querySelector('.tabs a[href="#' + name + '"]');
    document.title = (name === "home" ? "" : label.textContent + " · ") + "Jaypreet Singh | Data Engineer & BI Analyst";
    tabs.classList.remove("open"); toggle.setAttribute("aria-expanded", "false");
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.addEventListener("hashchange", function () { show(location.hash.slice(1)); });
  window.addEventListener("load", function () { setTimeout(function () { window.scrollTo({ top: 0, left: 0, behavior: "instant" }); }, 0); });
  show(location.hash.slice(1));

  toggle.addEventListener("click", function () {
    var o = tabs.classList.toggle("open");
    toggle.setAttribute("aria-expanded", o ? "true" : "false");
  });
  document.addEventListener("click", function (e) {
    var d = document.querySelector(".resume-menu");
    if (d.open && !d.contains(e.target)) d.removeAttribute("open");
  });
  document.querySelectorAll(".resume-menu a").forEach(function (a) {
    a.addEventListener("click", function () { a.closest("details").removeAttribute("open"); });
  });
})();

/* ----- Contact ----- */
(function () {
  var status = document.getElementById("copy-status");
  document.getElementById("copy-email").addEventListener("click", function () {
    var done = function () { status.textContent = "Email copied: " + SITE.email; };
    var fail = function () { status.textContent = "Couldn't copy automatically. My email is " + SITE.email; };
    try { navigator.clipboard.writeText(SITE.email).then(done, fail); } catch (e) { fail(); }
  });
  /* Contact form: sends straight to your inbox through FormSubmit (free, no account).
     The first message ever sent triggers a one-time "Activate form" email to SITE.email. */
  var form = document.getElementById("contact-form");
  var formStatus = document.getElementById("form-status");
  var submitBtn = document.getElementById("cf-submit");
  function mailtoFallback(name, from, msg) {
    var subject = "Portfolio inquiry from " + (name || "a visitor");
    var body = msg + "\n\n— " + name + (from ? "\n" + from : "");
    window.location.href = "mailto:" + SITE.email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    formStatus.textContent = "Couldn't send from the page, so your email app was opened instead. You can also email " + SITE.email + ".";
  }
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = document.getElementById("cf-name").value.trim();
    var from = document.getElementById("cf-email").value.trim();
    var msg = document.getElementById("cf-message").value.trim();
    if (document.getElementById("cf-honey").value) return; // spam bot
    submitBtn.disabled = true; submitBtn.querySelector("span").textContent = "Sending…";
    formStatus.textContent = "";
    fetch("https://formsubmit.co/ajax/" + SITE.email, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ name: name, email: from, message: msg, _subject: "Portfolio message from " + (name || "a visitor"), _template: "table", _replyto: from })
    }).then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (res) {
        if (res.ok && String(res.d.success) === "true") {
          form.reset();
          formStatus.textContent = "Thanks, " + (name.split(" ")[0] || "there") + "! Your message was sent. I'll reply to " + from + " soon.";
        } else { mailtoFallback(name, from, msg); }
      })
      .catch(function () { mailtoFallback(name, from, msg); })
      .then(function () { submitBtn.disabled = false; submitBtn.querySelector("span").textContent = "Send message"; });
  });
  document.getElementById("year").textContent = new Date().getFullYear();
})();
