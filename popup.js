chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "analysisResult") {
    const data = request.data;

    document.getElementById("persuasionScore").innerText =
      data.persuasionScore + "%";

    document.getElementById("manipulation").innerText =
      data.manipulation;

    document.getElementById("details").innerText =
      `Power: ${data.powerCount} | Scarcity: ${data.scarcityCount} | Fear: ${data.fearCount}`;
  }
});

// Trigger content script
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  chrome.tabs.sendMessage(tabs[0].id, { action: "analyze" });
});
