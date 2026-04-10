(function () {
  try {
    if (document.getElementById("seo-inspector-panel")) {
      return;
    }

    const issues = [];

    function createPanel() {
      const panel = document.createElement("div");
      panel.id = "seo-inspector-panel";
      panel.style.position = "fixed";
      panel.style.top = "20px";
      panel.style.right = "20px";
      panel.style.width = "300px";
      panel.style.maxHeight = "400px";
      panel.style.overflowY = "auto";
      panel.style.background = "#111";
      panel.style.color = "#fff";
      panel.style.padding = "10px";
      panel.style.borderRadius = "8px";
      panel.style.zIndex = "999999";
      panel.style.fontSize = "12px";
      panel.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)";
      panel.innerHTML = "<b>🔍 SEO Structure Report</b><br/><small>Client-side analysis</small><br/><br/>";
      document.body.appendChild(panel);
      return panel;
    }

    function addIssue(panel, title, reason, fix) {
      const div = document.createElement("div");
      div.style.marginBottom = "10px";
      div.innerHTML = `
        <b style="color:#ff5252;">${title}</b><br/>
        <small>Why: ${reason}</small><br/>
        <small style="color:#00e676;">Fix: ${fix}</small>
      `;
      panel.appendChild(div);
    }

    function highlight(el, color) {
      el.style.outline = `2px dashed ${color}`;
    }

    // Checks
    const h1 = document.querySelectorAll("h1").length;
    if (h1 === 0) {
      issues.push({
        title: "H1 not found",
        reason: "Search engines rely on H1 to understand page topic",
        fix: "Add one clear H1 with primary keyword"
      });
    }

    const h2 = document.querySelectorAll("h2").length;
    if (h2 === 0) {
      issues.push({
        title: "No H2 headings found",
        reason: "Poor structure affects readability and SEO",
        fix: "Break content into sections using H2"
      });
    }

    const meta = document.querySelector("meta[name='description']");
    if (!meta) {
      issues.push({
        title: "Meta description not found",
        reason: "Reduces search snippet control",
        fix: "Add a 140–160 character meta description"
      });
    }

    const paragraphs = document.querySelectorAll("p");
    let longCount = 0;

    paragraphs.forEach(p => {
      const words = p.innerText.split(/\s+/).length;
      if (words > 120) {
        longCount++;
        highlight(p, "orange");
      }
    });

    if (longCount > 0) {
      issues.push({
        title: "Long paragraphs detected",
        reason: "Hard to read and not AI-friendly",
        fix: "Keep paragraphs under 80 words"
      });
    }

    const lists = document.querySelectorAll("ul, ol").length;
    if (lists === 0) {
      issues.push({
        title: "No lists found",
        reason: "Lists improve readability",
        fix: "Add bullet points where possible"
      });
    }

    const links = [...document.querySelectorAll("a")];
    const internal = links.filter(a => a.href.includes(location.hostname)).length;

    if (internal < 3) {
      issues.push({
        title: "Low internal links",
        reason: "Weak internal SEO structure",
        fix: "Add at least 3–5 internal links"
      });
    }

    const text = document.body.innerText.toLowerCase();
    if (!text.includes("faq")) {
      issues.push({
        title: "FAQ section not found",
        reason: "Helps structured answers",
        fix: "Add FAQ section with questions and answers"
      });
    }

    if (issues.length > 0) {
      const panel = createPanel();
      issues.forEach(i => addIssue(panel, i.title, i.reason, i.fix));
    }

  } catch (e) {
    console.error(e);
  }
})();
