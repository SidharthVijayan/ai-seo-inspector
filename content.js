chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "analyze") {

    try {
      const fullText = document.body.innerText || "";
      const text = fullText.substring(0, 4000).toLowerCase();

      const title = document.title || "";
      const metaDescription = document.querySelector('meta[name="description"]')?.content || "";
      const h1Tags = document.querySelectorAll("h1");

      // ===== CONTENT METRICS =====
      const wordCount = fullText.split(/\s+/).length;
      const sentenceCount = fullText.split(/[.!?]/).length;
      const avgSentenceLength = Math.round(wordCount / (sentenceCount || 1));

      // ===== HEADINGS =====
      const headings = Array.from(document.querySelectorAll("h1,h2,h3"))
        .map(h => h.innerText.toLowerCase());

      // ===== KEYWORD LISTS =====
      const powerWords = ["best","ultimate","top","proven","exclusive","powerful"];
      const faqWords = ["what","how","why","when","which"];

      function countWords(list, text) {
        let count = 0;
        for (let word of list) {
          if (text.includes(word)) count += text.split(word).length - 1;
        }
        return count;
      }

      const powerCount = countWords(powerWords, text);

      // ===== SEO SCORE =====
      let seoScore = 100;

      if (title.length < 40 || title.length > 60) seoScore -= 15;
      if (!metaDescription) seoScore -= 20;
      if (h1Tags.length !== 1) seoScore -= 15;
      if (wordCount < 600) seoScore -= 20;

      // ===== AI / LLM READINESS =====
      let aiScore = 0;

      if (h1Tags.length === 1) aiScore += 20;
      if (wordCount > 800) aiScore += 20;
      if (avgSentenceLength < 20) aiScore += 15;
      if (headings.length > 5) aiScore += 15;

      // FAQ detection
      if (faqWords.some(w => text.includes(w))) aiScore += 20;

      // structured style detection
      if (text.includes(":") || text.includes("-")) aiScore += 10;

      aiScore = Math.min(aiScore, 100);

      // ===== ORIGINALITY (HEURISTIC) =====
      let originality = 100;

      const repeatedWords = text.split(" ").filter((w, i, arr) => arr.indexOf(w) !== i);
      if (repeatedWords.length > wordCount * 0.3) originality -= 30;

      if (powerCount > 10) originality -= 20;

      // ===== SEO ISSUES =====
      let issues = [];

      if (title.length < 40) issues.push("Title too short for CTR");
      if (!metaDescription) issues.push("Missing meta description");
      if (h1Tags.length !== 1) issues.push("Incorrect H1 usage");
      if (wordCount < 600) issues.push("Content too thin vs competitors");

      // ===== LLM OPTIMIZATION SUGGESTIONS =====
      let llmSuggestions = [];

      if (wordCount < 800)
        llmSuggestions.push("Increase depth to 800–1500 words for AI visibility");

      if (!faqWords.some(w => text.includes(w)))
        llmSuggestions.push("Add FAQ-style sections (What, How, Why)");

      if (avgSentenceLength > 20)
        llmSuggestions.push("Use shorter sentences for better AI extraction");

      if (headings.length < 5)
        llmSuggestions.push("Add structured headings (H2/H3)");

      if (!text.includes(":"))
        llmSuggestions.push("Use lists or definitions (AI prefers structured data)");

      const result = {
        seoScore,
        aiScore,
        originality,
        wordCount,
        avgSentenceLength,
        issues,
        llmSuggestions,
        text: fullText.substring(0, 1000)
      };

      chrome.storage.local.set({ seoData: result });

      chrome.runtime.sendMessage({
        action: "analysisResult",
        data: result
      });

    } catch (err) {
      console.error(err);
    }
  }
});
