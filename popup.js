document.addEventListener("DOMContentLoaded", () => {

  chrome.storage.local.get("seoData", (res) => {
    if (res.seoData) {
      document.getElementById("metrics").innerText =
        "Words: " + res.seoData.wordCount;
    }
  });

  setTimeout(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "analyze" });
    });
  }, 100);
});

// BASIC DATA
chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "analysisResult") {
    document.getElementById("metrics").innerText =
      "Words: " + request.data.wordCount;
  }

  if (request.action === "aiResult") {
    document.getElementById("aiInsights").innerText =
      request.data;
  }
});
