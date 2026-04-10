// popup.js

document.addEventListener("DOMContentLoaded", () => {
  const analyzeBtn = document.getElementById("analyzeBtn");
  const results = document.getElementById("results");

  analyzeBtn.addEventListener("click", async () => {
    try {
      results.innerHTML = "<small>Analyzing page...</small>";

      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
      });

      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"]
      });

      results.innerHTML = "<small>Analysis injected. Check page for report.</small>";

    } catch (error) {
      console.error(error);
      results.innerHTML = "<span style='color:red;'>Error running analysis</span>";
    }
  });
});
