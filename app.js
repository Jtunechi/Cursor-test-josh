/**
 * Account Plan Builder
 * Reads form inputs and generates a structured account plan on the page.
 */

(function () {
  "use strict";

  var form = document.getElementById("account-form");
  var output = document.getElementById("plan-output");
  var loadSampleBtn = document.getElementById("load-sample-btn");
  var clearFormBtn = document.getElementById("clear-form-btn");
  var companyNameInput = document.getElementById("company-name");
  var companyNameError = document.getElementById("error-company-name");

  var SAMPLE_DATA = {
    companyName: "Northwind Industries",
    industry: "Retail & E-Commerce",
    currentTools: "Tableau, Snowflake, Excel, legacy SQL reports",
    businessInitiatives: "Modernize analytics stack, enable self-serve BI for business teams, reduce reporting backlog",
    painPoints: "Slow dashboard refresh times, IT bottleneck for ad-hoc requests, inconsistent metrics across departments",
    keyPersonas: "VP of Data & Analytics, Data Engineering Lead, Finance Analyst, Merchandising Director",
    competitors: "Tableau, Looker, Power BI",
  };

  var ICONS = {
    summary: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
    hypotheses: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.74V17h8v-2.26A7 7 0 0 0 12 2z"/></svg>',
    stakeholders: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    discovery: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    valueProp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
    actionPlan: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  };

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!validateForm()) return;
    var data = collectFormData();
    renderPlan(data);
    output.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  loadSampleBtn.addEventListener("click", function () {
    setFormValues(SAMPLE_DATA);
    clearFieldError(companyNameInput, companyNameError);
    form.classList.add("form--sample-loaded");
    setTimeout(function () {
      form.classList.remove("form--sample-loaded");
    }, 600);
  });

  clearFormBtn.addEventListener("click", function () {
    form.reset();
    clearAllErrors();
    hidePlan();
    companyNameInput.focus();
  });

  companyNameInput.addEventListener("input", function () {
    if (companyNameInput.value.trim()) {
      clearFieldError(companyNameInput, companyNameError);
    }
  });

  companyNameInput.addEventListener("blur", function () {
    if (!companyNameInput.value.trim()) {
      showFieldError(companyNameInput, companyNameError, "Company name is required to generate an account plan.");
    }
  });

  function validateForm() {
    var isValid = true;
    clearAllErrors();

    if (!companyNameInput.value.trim()) {
      showFieldError(companyNameInput, companyNameError, "Company name is required to generate an account plan.");
      companyNameInput.focus();
      isValid = false;
    }

    return isValid;
  }

  function showFieldError(input, errorEl, message) {
    input.classList.add("form__input--error");
    input.setAttribute("aria-invalid", "true");
    errorEl.textContent = message;
    errorEl.classList.add("form__error--visible");
  }

  function clearFieldError(input, errorEl) {
    input.classList.remove("form__input--error");
    input.removeAttribute("aria-invalid");
    errorEl.textContent = "";
    errorEl.classList.remove("form__error--visible");
  }

  function clearAllErrors() {
    clearFieldError(companyNameInput, companyNameError);
  }

  function setFormValues(data) {
    document.getElementById("company-name").value = data.companyName;
    document.getElementById("industry").value = data.industry;
    document.getElementById("current-tools").value = data.currentTools;
    document.getElementById("business-initiatives").value = data.businessInitiatives;
    document.getElementById("pain-points").value = data.painPoints;
    document.getElementById("key-personas").value = data.keyPersonas;
    document.getElementById("competitors").value = data.competitors;
  }

  function hidePlan() {
    output.innerHTML = "";
    output.classList.add("plan-output--hidden");
  }

  function collectFormData() {
    return {
      companyName: getValue("company-name"),
      industry: getValue("industry"),
      currentTools: getValue("current-tools"),
      businessInitiatives: getValue("business-initiatives"),
      painPoints: getValue("pain-points"),
      keyPersonas: getValue("key-personas"),
      competitors: getValue("competitors"),
    };
  }

  function getValue(id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : "";
  }

  function renderPlan(data) {
    var today = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    output.innerHTML =
      '<div class="plan-header">' +
        '<h2 class="plan-header__title">Account Plan: ' + escapeHtml(data.companyName) + "</h2>" +
        '<span class="plan-header__meta">Generated ' + today + "</span>" +
      "</div>" +
      section(ICONS.summary, "Executive Summary", buildExecutiveSummary(data)) +
      section(ICONS.hypotheses, "Top 3 Business Hypotheses", buildHypotheses(data)) +
      section(ICONS.stakeholders, "Likely Technical Stakeholders", buildStakeholders(data)) +
      section(ICONS.discovery, "Discovery Questions", buildDiscoveryQuestions(data)) +
      section(ICONS.valueProp, "Potential Sigma Value Prop", buildValueProp(data)) +
      section(ICONS.actionPlan, "Mutual Action Plan — Next Steps", buildActionPlan(data));

    output.classList.remove("plan-output--hidden");
  }

  function section(iconSvg, title, bodyHtml) {
    return (
      '<div class="plan-section">' +
        '<h3 class="plan-section__title">' +
          '<span class="plan-section__icon">' + iconSvg + "</span>" +
          escapeHtml(title) +
        "</h3>" +
        '<div class="plan-section__body">' + bodyHtml + "</div>" +
      "</div>"
    );
  }

  /* ---- Content builders ---- */

  function buildExecutiveSummary(data) {
    var industry = data.industry || "their industry";
    var tools = data.currentTools || "legacy analytics tools";
    var initiatives = data.businessInitiatives || "modernizing their data and analytics stack";
    var pains = data.painPoints || "slow time-to-insight and limited self-serve capabilities";

    return (
      "<p><strong>" + escapeHtml(data.companyName) + "</strong> is a " +
      escapeHtml(industry) + " organization currently leveraging " +
      escapeHtml(tools) + ". Their leadership is focused on " +
      escapeHtml(initiatives) + ", but teams are likely experiencing " +
      escapeHtml(pains) + ".</p>" +
      "<p>Sigma presents an opportunity to unify analytics on the cloud data warehouse, " +
      "empowering business users with spreadsheet-familiar self-serve analytics while " +
      "maintaining governance and reducing dependency on IT and data engineering bottlenecks.</p>"
    );
  }

  function buildHypotheses(data) {
    var hypotheses = [
      {
        label: "Hypothesis 1 — Speed to Insight",
        text: buildSpeedHypothesis(data),
      },
      {
        label: "Hypothesis 2 — Self-Serve Gap",
        text: buildSelfServeHypothesis(data),
      },
      {
        label: "Hypothesis 3 — Competitive Pressure",
        text: buildCompetitiveHypothesis(data),
      },
    ];

    return hypotheses
      .map(function (h) {
        return (
          '<div class="hypothesis-item">' +
            '<div class="hypothesis-item__label">' + escapeHtml(h.label) + "</div>" +
            "<p>" + escapeHtml(h.text) + "</p>" +
          "</div>"
        );
      })
      .join("");
  }

  function buildSpeedHypothesis(data) {
    if (data.painPoints) {
      return data.companyName + "'s teams are slowed by " + data.painPoints +
        ", creating a backlog that delays critical business decisions.";
    }
    return data.companyName + "'s analytics workflows require too many handoffs between " +
      "business users and technical teams, delaying decisions by days or weeks.";
  }

  function buildSelfServeHypothesis(data) {
    if (data.businessInitiatives) {
      return "Leadership wants to " + data.businessInitiatives +
        ", but current tools don't give non-technical users the autonomy to explore data independently.";
    }
    return "Business users rely heavily on centralized BI or data teams for ad-hoc analysis, " +
      "limiting agility and creating an IT bottleneck.";
  }

  function buildCompetitiveHypothesis(data) {
    if (data.competitors) {
      return data.companyName + " is evaluating or already using " + data.competitors +
        ", but may be hitting limitations around scalability, usability, or total cost of ownership.";
    }
    return data.companyName + " may be outgrowing their current BI platform and seeking a " +
      "modern, cloud-native alternative that scales with their data warehouse.";
  }

  function buildStakeholders(data) {
    var personas = parseList(data.keyPersonas);
    var defaultStakeholders = [
      { role: "VP / Head of Data & Analytics", focus: "Owns analytics strategy, tool selection, and ROI" },
      { role: "Data Engineering Lead", focus: "Manages pipelines, warehouse architecture, and governance" },
      { role: "BI / Analytics Manager", focus: "Day-to-day dashboarding, reporting, and user enablement" },
      { role: "Business Unit Leader", focus: "Needs fast, trusted insights to drive revenue decisions" },
    ];

    var stakeholders = personas.length > 0
      ? personas.map(function (p) {
          return { role: p, focus: inferFocus(p) };
        })
      : defaultStakeholders;

    return (
      '<div class="stakeholder-grid">' +
      stakeholders
        .map(function (s) {
          return (
            '<div class="stakeholder-card">' +
              '<div class="stakeholder-card__role">' + escapeHtml(s.role) + "</div>" +
              '<div class="stakeholder-card__focus">' + escapeHtml(s.focus) + "</div>" +
            "</div>"
          );
        })
        .join("") +
      "</div>"
    );
  }

  function inferFocus(persona) {
    var lower = persona.toLowerCase();
    if (lower.indexOf("vp") !== -1 || lower.indexOf("director") !== -1 || lower.indexOf("head") !== -1) {
      return "Decision-maker — cares about strategy, budget, and business outcomes";
    }
    if (lower.indexOf("engineer") !== -1 || lower.indexOf("architect") !== -1) {
      return "Technical evaluator — cares about integration, performance, and security";
    }
    if (lower.indexOf("analyst") !== -1 || lower.indexOf("bi") !== -1) {
      return "Power user — cares about ease of use, speed, and data accuracy";
    }
    if (lower.indexOf("finance") !== -1 || lower.indexOf("cfo") !== -1) {
      return "Business stakeholder — cares about financial reporting and forecasting";
    }
    return "Key influencer in the evaluation and adoption process";
  }

  function buildDiscoveryQuestions(data) {
    var questions = [
      "What does your current analytics workflow look like from question to answer?",
      "How long does it typically take a business user to get a new report or ad-hoc analysis?",
      "Where does your team spend the most time — data prep, building dashboards, or waiting on others?",
    ];

    if (data.currentTools) {
      questions.push("What do you like and dislike about " + data.currentTools + "?");
    } else {
      questions.push("What tools is your team using today for reporting and ad-hoc analysis?");
    }

    if (data.businessInitiatives) {
      questions.push("How are you measuring success for " + data.businessInitiatives + "?");
    }

    if (data.painPoints) {
      questions.push("Can you walk me through a recent example where " + data.painPoints + " caused a problem?");
    }

    if (data.competitors) {
      questions.push("Have you evaluated " + data.competitors + "? What drove that evaluation?");
    }

    questions.push("Who else on your team should be involved in this conversation?");
    questions.push("What would a successful analytics platform look like 12 months from now?");

    return "<ol>" + questions.map(function (q) {
      return "<li>" + escapeHtml(q) + "</li>";
    }).join("") + "</ol>";
  }

  function buildValueProp(data) {
    var points = [
      "<strong>Spreadsheet-familiar interface</strong> — Business users can explore live warehouse data " +
        "with the formulas and workflows they already know, no SQL required.",
      "<strong>Live connection to your cloud warehouse</strong> — No data extracts or copies. " +
        "Query billions of rows directly on Snowflake, Databricks, BigQuery, or Redshift.",
      "<strong>Governed self-serve</strong> — IT maintains control over data models and permissions " +
        "while empowering every team to answer their own questions.",
      "<strong>Faster time to value</strong> — Reduce the backlog on your data team and cut " +
        "reporting cycles from weeks to minutes.",
    ];

    if (data.currentTools) {
      points.push(
        "<strong>Modern alternative to " + escapeHtml(data.currentTools) + "</strong> — " +
        "Lower TCO, better performance at scale, and a user experience designed for the cloud era."
      );
    }

    if (data.competitors) {
      points.push(
        "<strong>Competitive differentiation vs. " + escapeHtml(data.competitors) + "</strong> — " +
        "Sigma's warehouse-native architecture avoids the limitations of traditional BI " +
        "and embedded analytics platforms."
      );
    }

    return "<ul>" + points.map(function (p) {
      return "<li>" + p + "</li>";
    }).join("") + "</ul>";
  }

  function buildActionPlan(data) {
    var steps = [
      {
        title: "Schedule discovery call with key stakeholders",
        detail: "Include " + (data.keyPersonas || "VP Analytics, Data Engineering, and a business unit leader") +
          " to validate hypotheses and pain points.",
      },
      {
        title: "Confirm technical environment",
        detail: "Document their cloud data warehouse, current tools (" +
          (data.currentTools || "TBD") + "), and data governance requirements.",
      },
      {
        title: "Deliver tailored Sigma demo",
        detail: "Show live warehouse queries, self-serve exploration, and dashboarding " +
          "using sample data relevant to " + data.industry + (data.industry ? "" : " their business") + ".",
      },
      {
        title: "Share customer proof points",
        detail: "Provide 1–2 case studies from " + (data.industry || "a similar industry") +
          " highlighting time-to-insight and self-serve adoption metrics.",
      },
      {
        title: "Propose proof of value (POV)",
        detail: "Scope a 2–4 week POV on their warehouse with 2–3 high-impact use cases " +
          "aligned to " + (data.businessInitiatives || "their top business initiatives") + ".",
      },
      {
        title: "Align on mutual action plan",
        detail: "Document decision criteria, timeline, economic buyer, and next meeting date before leaving the call.",
      },
    ];

    return steps
      .map(function (step, i) {
        return (
          '<div class="action-step">' +
            '<span class="action-step__number">' + (i + 1) + "</span>" +
            '<div class="action-step__content">' +
              '<div class="action-step__title">' + escapeHtml(step.title) + "</div>" +
              '<div class="action-step__detail">' + escapeHtml(step.detail) + "</div>" +
            "</div>" +
          "</div>"
        );
      })
      .join("");
  }

  /* ---- Utilities ---- */

  function parseList(text) {
    if (!text) return [];
    return text
      .split(/[,;\n]+/)
      .map(function (s) { return s.trim(); })
      .filter(function (s) { return s.length > 0; });
  }

  function escapeHtml(str) {
    if (!str) return "";
    var div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }
})();
