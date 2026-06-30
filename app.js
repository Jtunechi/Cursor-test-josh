/**
 * Account Plan Builder
 * Reads form inputs and generates a structured account plan for Sigma sales.
 */

const form = document.getElementById("account-form");
const planOutput = document.getElementById("plan-output");
const printButton = document.getElementById("print-plan");

form.addEventListener("submit", function (event) {
  event.preventDefault();
  const data = getFormData();
  renderAccountPlan(data);
  planOutput.classList.remove("hidden");
  planOutput.scrollIntoView({ behavior: "smooth", block: "start" });
});

printButton.addEventListener("click", function () {
  window.print();
});

function getFormData() {
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
  const el = document.getElementById(id);
  return el ? el.value.trim() : "";
}

function renderAccountPlan(data) {
  document.getElementById("plan-company-title").textContent =
    data.companyName + " — Account Plan";

  document.getElementById("executive-summary").textContent =
    buildExecutiveSummary(data);

  fillList("business-hypotheses", buildHypotheses(data), true);
  fillList("technical-stakeholders", buildStakeholders(data));
  fillList("discovery-questions", buildDiscoveryQuestions(data));
  fillList("sigma-value-prop", buildSigmaValueProp(data));
  fillActionPlan("mutual-action-plan", buildMutualActionPlan(data));
}

function fillList(elementId, items, ordered) {
  const list = document.getElementById(elementId);
  list.innerHTML = "";

  items.forEach(function (item) {
    const li = document.createElement("li");
    li.textContent = item;
    list.appendChild(li);
  });
}

function fillActionPlan(elementId, steps) {
  const list = document.getElementById(elementId);
  list.innerHTML = "";

  steps.forEach(function (step) {
    const li = document.createElement("li");
    li.innerHTML =
      step.title +
      '<span class="step-meta">' +
      step.owner +
      " · " +
      step.timing +
      "</span>";
    list.appendChild(li);
  });
}

/* ---- Content builders ---- */

function buildExecutiveSummary(data) {
  const company = data.companyName || "This account";
  const industry = data.industry
    ? " in the " + data.industry + " space"
    : "";
  const tools = data.currentTools
    ? " Their current stack includes " + summarizeList(data.currentTools) + "."
    : "";
  const initiatives = data.businessInitiatives
    ? " Key initiatives include " + summarizeList(data.businessInitiatives) + "."
    : "";
  const pains = data.painPoints
    ? " Suspected challenges around " + summarizeList(data.painPoints) + " suggest an opportunity for Sigma to accelerate self-service analytics while maintaining governance."
    : " There is an opportunity for Sigma to help the team move faster on analytics without adding BI backlog.";

  return (
    company +
    " is a target account" +
    industry +
    "." +
    tools +
    initiatives +
    pains +
    " Sigma can position as a cloud-native analytics platform that lets business users explore live data directly—without exporting to spreadsheets or waiting on centralized BI teams."
  );
}

function buildHypotheses(data) {
  const hypotheses = [];

  if (data.businessInitiatives) {
    hypotheses.push(
      data.companyName +
        " is prioritizing " +
        firstItem(data.businessInitiatives) +
        ", and needs faster access to trusted data to hit related KPIs."
    );
  } else {
    hypotheses.push(
      (data.companyName || "This account") +
        " leadership wants to reduce time-to-insight for business teams without sacrificing data governance."
    );
  }

  if (data.painPoints) {
    hypotheses.push(
      "Teams are experiencing friction from " +
        firstItem(data.painPoints) +
        ", which may be slowing decision-making and creating shadow analytics in spreadsheets."
    );
  } else {
    hypotheses.push(
      "Centralized BI or legacy tooling may be creating a backlog, pushing analysts and business users toward manual workarounds."
    );
  }

  if (data.competitors) {
    hypotheses.push(
      "Incumbent tools such as " +
        firstItem(data.competitors) +
        " may not fully address self-service at scale on their cloud data platform, opening room for Sigma's spreadsheet-like UX on live data."
    );
  } else {
    hypotheses.push(
      "Sigma can differentiate by offering governed, live-query analytics that feels familiar to Excel users while connecting directly to the cloud warehouse."
    );
  }

  return hypotheses.slice(0, 3);
}

function buildStakeholders(data) {
  const stakeholders = [];

  if (data.keyPersonas) {
    splitItems(data.keyPersonas).forEach(function (persona) {
      stakeholders.push(
        persona +
          " — likely cares about business outcomes, adoption, and time-to-value for analytics initiatives."
      );
    });
  }

  const defaults = [
    "Head of Data / Analytics — owns the modern data stack, semantic layer, and BI tool selection.",
    "Data Engineering Lead — evaluates warehouse connectivity, performance, and security requirements.",
    "IT / InfoSec — reviews SSO, row-level security, audit logs, and vendor compliance.",
    "Finance or Operations Leader — potential executive sponsor if initiatives tie to revenue, margin, or efficiency KPIs.",
  ];

  defaults.forEach(function (role) {
    if (stakeholders.length < 5) {
      stakeholders.push(role);
    }
  });

  return stakeholders.slice(0, 5);
}

function buildDiscoveryQuestions(data) {
  const questions = [
    "Walk me through how a business user gets an answer to a new question today—from request to insight.",
    "Where does your team store the 'source of truth' metrics, and how consistently are they used across departments?",
    "What cloud data warehouse or lakehouse are you standardized on, and who manages access?",
  ];

  if (data.currentTools) {
    questions.push(
      "You mentioned " +
        firstItem(data.currentTools) +
        "—what's working well, and where do users still export to Excel or Slack screenshots?"
    );
  }

  if (data.painPoints) {
    questions.push(
      "How is " +
        firstItem(data.painPoints) +
        " impacting team productivity or executive confidence in the numbers?"
    );
  }

  if (data.businessInitiatives) {
    questions.push(
      "For " +
        firstItem(data.businessInitiatives) +
        ", what metrics would prove success in the next two quarters?"
    );
  }

  if (data.competitors) {
    questions.push(
      "Have you evaluated or are you currently using " +
        firstItem(data.competitors) +
        "? What would make you consider an alternative?"
    );
  }

  questions.push(
    "Who would need to sign off on a new analytics platform purchase, and what does your typical evaluation timeline look like?"
  );

  return questions.slice(0, 7);
}

function buildSigmaValueProp(data) {
  const props = [
    "Spreadsheet-like interface on live cloud data—business users analyze billions of rows without extracts or downloads.",
    "Direct connection to modern warehouses (Snowflake, Databricks, BigQuery, Redshift, etc.) with push-down compute for fast queries.",
    "Governed semantic layer and row-level security so IT keeps control while enabling self-service at scale.",
  ];

  if (data.painPoints && containsAny(data.painPoints, ["backlog", "wait", "slow"])) {
    props.push(
      "Reduce BI team backlog by letting certified datasets be explored safely by domain experts."
    );
  }

  if (data.painPoints && containsAny(data.painPoints, ["metric", "inconsistent", "trust"])) {
    props.push(
      "Single source of truth for KPIs with reusable data models that eliminate conflicting dashboard versions."
    );
  }

  if (data.competitors && containsAny(data.competitors, ["tableau", "looker", "power bi", "thoughtspot"])) {
    props.push(
      "Lower total cost of ownership vs. traditional BI—no per-viewer extract infrastructure and faster time-to-value for business teams."
    );
  }

  if (data.businessInitiatives) {
    props.push(
      "Accelerate " +
        firstItem(data.businessInitiatives) +
        " by giving stakeholders direct access to the metrics that drive that initiative."
    );
  }

  return props.slice(0, 5);
}

function buildMutualActionPlan(data) {
  const company = data.companyName || "Prospect";

  return [
    {
      title: "Schedule 45-min discovery call with data & analytics stakeholders",
      owner: "Sigma AE + " + company + " sponsor",
      timing: "Week 1",
    },
    {
      title: "Share relevant Sigma customer story and 2-page overview tailored to " + (data.industry || "their industry"),
      owner: "Sigma AE",
      timing: "Week 1",
    },
    {
      title: "Confirm cloud data platform, security requirements, and evaluation criteria",
      owner: company + " IT / Data Engineering",
      timing: "Week 2",
    },
    {
      title: "Run tailored Sigma demo using sample data mapped to their use case",
      owner: "Sigma AE + SE",
      timing: "Week 2–3",
    },
    {
      title: "Identify 1–2 pilot use cases with measurable success criteria",
      owner: "Joint",
      timing: "Week 3",
    },
    {
      title: "Deliver POC or guided trial with executive readout on findings",
      owner: "Sigma SE + " + company + " analytics team",
      timing: "Week 4–6",
    },
  ];
}

/* ---- Helpers ---- */

function splitItems(text) {
  return text
    .split(/[,;\n]+/)
    .map(function (s) {
      return s.trim();
    })
    .filter(Boolean);
}

function firstItem(text) {
  const items = splitItems(text);
  return items.length ? items[0] : text;
}

function summarizeList(text) {
  const items = splitItems(text);
  if (items.length === 0) return text;
  if (items.length === 1) return items[0];
  if (items.length === 2) return items[0] + " and " + items[1];
  return items.slice(0, -1).join(", ") + ", and " + items[items.length - 1];
}

function containsAny(text, keywords) {
  const lower = text.toLowerCase();
  return keywords.some(function (kw) {
    return lower.indexOf(kw) !== -1;
  });
}
