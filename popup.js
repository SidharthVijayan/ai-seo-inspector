let pageText = "";

// LOAD CACHE FIRST
document.addEventListener("DOMContentLoaded", () => {

  chrome.storage.local.get("seoData", (res) => {
    if (res.seoData) updateUI(res.seoData);
  });

  // trigger fresh analysis
  setTimeout(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "analyze" });
    });
  }, 100);
});

// UPDATE UI
function updateUI(d) {
  pageText = d.text || "";

  document.getElementById("seoScore").innerText = d.seoScore + "%";
  document.getElementById("persuasionScore").innerText = d.persuasionScore + "%";
  document.getElementById("manipulation").innerText = d.manipulation;

  document.getElementById("details").innerText =
    `Power: ${d.powerCount} | Scarcity: ${d.scarcityCount} | Fear: ${d.fearCount}`;

  // suggestions
  const sugBox = document.getElementById("suggestions");
  sugBox.innerHTML = "";

  if (!d.suggestions.length) {
    sugBox.innerHTML = "<p>All good 👍</p>";
  } else {
    d.suggestions.forEach(s => {
      const p = document.createElement("p");
      p.innerText = "• " + s;
      sugBox.appendChild(p);
    });
  }

  // insights
  document.getElementById("insights").innerText =
    `Word count: ${d.wordCount}, Avg sentence length: ${d.avgSentenceLength}.

Persuasion level is ${d.persuasionScore}%, indicating ${
      d.persuasionScore > 60
        ? "strong marketing intent."
        : d.persuasionScore > 30
        ? "moderate persuasion."
        : "low persuasive impact."
    }`;
}

// RECEIVE LIVE
chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "analysisResult") {
    updateUI(request.data);
  }
});

// REWRITE
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("rewriteBtn").addEventListener("click", () => {

    if (!pageText) {
      document.getElementById("rewriteOutput").innerText = "Still loading...";
      return;
    }

    let rewritten = "Improved Version:\n\n";

    rewritten += pageText
      .replace(/very/gi, "extremely")
      .replace(/good/gi, "high-quality")
      .replace(/bad/gi, "suboptimal");

    rewritten = rewritten.substring(0, 400) + "...";

    document.getElementById("rewriteOutput").innerText = rewritten;
  });
});
