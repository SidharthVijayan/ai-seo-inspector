// LISTEN for popup trigger
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "analyze") {

    // Run analysis
    setTimeout(() => {

      const fullText = document.body.innerText;
      const text = fullText.substring(0, 3000).toLowerCase();

      const title = document.title;
      const metaDescription = document.querySelector('meta[name="description"]')?.content || "";
      const h1Tags = document.querySelectorAll("h1");

      const powerWords = ["secret", "proven", "instant"];
      const scarcityWords = ["limited", "hurry"];
      const fearWords = ["danger", "risk"];

      function countWords(list, text) {
        let count = 0;
        for (let word of list) {
          if (text.includes(word)) {
            count += text.split(word).length - 1;
          }
        }
        return count;
      }

      const powerCount = countWords(powerWords, text);
      const scarcityCount = countWords(scarcityWords, text);
      const fearCount = countWords(fearWords, text);

      let persuasionScore = Math.min(100,
        powerCount * 2 + scarcityCount * 3 + fearCount * 2
      );

      let manipulation = "LOW";
      if (persuasionScore > 60) manipulation = "HIGH";
      else if (persuasionScore > 30) manipulation = "MEDIUM";

      let seoScore = 100;

      if (title.length < 30 || title.length > 60) seoScore -= 15;
      if (metaDescription.length < 50 || metaDescription.length > 160) seoScore -= 15;
      if (h1Tags.length === 0) seoScore -= 20;
      if (h1Tags.length > 1) seoScore -= 10;

      let suggestions = [];

      if (title.length < 30) suggestions.push("Improve title length");
      if (metaDescription.length < 50) suggestions.push("Add meta description");
      if (h1Tags.length === 0) suggestions.push("Add H1");

      chrome.runtime.sendMessage({
        action: "analysisResult",
        data: {
          seoScore,
          persuasionScore,
          manipulation,
          powerCount,
          scarcityCount,
          fearCount,
          suggestions,
          text: fullText.substring(0, 1000)
        }
      });

    }, 50);
  }
});
