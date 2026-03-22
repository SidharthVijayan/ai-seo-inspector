let currentData = null;

document.addEventListener("DOMContentLoaded", () => {

  chrome.storage.local.get("seoData", (res) => {
    if (res.seoData) updateUI(res.seoData);
  });

  setTimeout(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "analyze" });
    });
  }, 100);
});

function updateUI(d) {
  currentData = d;

  document.getElementById("seoScore").innerText = d.seoScore + "%";
  document.getElementById("aiScore").innerText = d.aiScore + "%";
  document.getElementById("originality").innerText = d.originality + "%";

  document.getElementById("metrics").innerText =
    `Words: ${d.wordCount} | Avg sentence: ${d.avgSentenceLength}`;

  const issueBox = document.getElementById("issues");
  issueBox.innerHTML = "";
  d.issues.forEach(i => {
    const p = document.createElement("p");
    p.innerText = "⚠️ " + i;
    issueBox.appendChild(p);
  });

  const llmBox = document.getElementById("llm");
  llmBox.innerHTML = "";
  d.llmSuggestions.forEach(s => {
    const p = document.createElement("p");
    p.innerText = "• " + s;
    llmBox.appendChild(p);
  });
}

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "analysisResult") {
    updateUI(request.data);
  }
});

// ===== REPORT DOWNLOAD =====
document.addEventListener("DOMContentLoaded", () => {

  document.getElementById("downloadReport").addEventListener("click", () => {

    if (!currentData) {
      alert("No data yet.");
      return;
    }

    const d = currentData;

    const recommendedTitle = `${d.title} | Optimized for SEO & AI`;

    const recommendedDesc =
      "Improve rankings and AI visibility with structured, high-quality content.";

    const recommendedH1 = `Complete Guide: ${d.title}`;

    const csv = [
      [
        "URL","CTR","Avg.Pos","Organic Traffic 2025","Word Count","AI Score",
        "Meta Title Change","Meta Description Change","H1 Change",
        "Existing Meta Title","Recommended Meta Title",
        "Existing Meta Description","Recommended Meta Description",
        "Existing H1","Recommended H1"
      ],
      [
        d.url,
        "5%",
        "5",
        Math.round(d.wordCount * 1.2),
        d.wordCount,
        d.aiScore,
        "YES",
        "YES",
        "YES",
        d.title,
        recommendedTitle,
        d.metaDescription,
        recommendedDesc,
        d.h1,
        recommendedH1
      ]
    ];

    const csvContent = csv.map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "SEO_Report.csv";
    a.click();
  });
});
