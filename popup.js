function getColorClass(value, type = "score") {
  if (type === "risk") {
    if (value === "HIGH") return "high";
    if (value === "MEDIUM") return "medium";
    return "low";
  }

  if (value > 70) return "low";
  if (value > 40) return "medium";
  return "high";
}

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "analysisResult") {
    const d = request.data;

    // SEO
    const seoEl = document.getElementById("seoScore");
    seoEl.innerText = d.seoScore + "%";
    seoEl.className = "score " + getColorClass(d.seoScore);

    // Persuasion
    const pEl = document.getElementById("persuasionScore");
    pEl.innerText = d.persuasionScore + "%";
    pEl.className = "score " + getColorClass(d.persuasionScore);

    // Manipulation
    const mEl = document.getElementById("manipulation");
    mEl.innerText = d.manipulation;
    mEl.className = "score " + getColorClass(d.manipulation, "risk");

    // Breakdown
    document.getElementById("details").innerText =
      `Power: ${d.powerCount} | Scarcity: ${d.scarcityCount} | Fear: ${d.fearCount}`;

    // Suggestions
    const sugBox = document.getElementById("suggestions");
    sugBox.innerHTML = "";

    if (d.suggestions.length === 0) {
      sugBox.innerHTML = "<p>All good 👍</p>";
    } else {
      d.suggestions.forEach(s => {
        const li = document.createElement("p");
        li.innerText = "• " + s;
        sugBox.appendChild(li);
      });
    }
  }
});

// Trigger analysis
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  chrome.tabs.sendMessage(tabs[0].id, { action: "analyze" });
});
