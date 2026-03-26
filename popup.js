document.addEventListener("DOMContentLoaded", () => {

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0].id;

    chrome.scripting.executeScript(
      {
        target: { tabId },
        files: ["content.js"]
      },
      () => {
        chrome.tabs.sendMessage(tabId, { action: "analyze" });
      }
    );
  });

});

// Listen for results
chrome.runtime.onMessage.addListener((request) => {

  if (request.action === "analysisResult") {
    document.getElementById("metrics").innerText =
      `Words: ${request.data.wordCount}`;
  }

  if (request.action === "aiResult") {
    document.getElementById("aiInsights").innerText =
      request.data || "No AI result";
  }

});
