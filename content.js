// content.js

(function () {
  try {
    console.log("SEO & Content Structure Inspector loaded");

    // Basic page info (safe + useful)
    const pageData = {
      url: window.location.href,
      title: document.title,
      wordCount: document.body.innerText.split(/\s+/).length
    };

    console.log("Page Info:", pageData);

    // Optional: highlight missing H1 (visual feedback for future pro feature)
    const h1s = document.querySelectorAll("h1");

    if (h1s.length === 0) {
      console.warn("No H1 found on this page");

      // Add small visual indicator (non-intrusive)
      const warning = document.createElement("div");
      warning.innerText = "⚠️ No H1 tag found";
      warning.style.position = "fixed";
      warning.style.bottom = "10px";
      warning.style.right = "10px";
      warning.style.background = "#ff5252";
      warning.style.color = "#fff";
      warning.style.padding = "6px 10px";
      warning.style.fontSize = "12px";
      warning.style.borderRadius = "4px";
      warning.style.zIndex = "999999";

      document.body.appendChild(warning);
    }

    // Highlight long paragraphs (future GEO feature)
    const paragraphs = document.querySelectorAll("p");

    paragraphs.forEach(p => {
      const wordCount = p.innerText.split(/\s+/).length;

      if (wordCount > 120) {
        p.style.outline = "2px dashed orange";
        p.title = "Long paragraph (reduce for better readability & AI parsing)";
      }
    });

    // Detect missing meta description (silent log)
    const metaDesc = document.querySelector("meta[name='description']");
    if (!metaDesc) {
      console.warn("Meta description missing");
    }

  } catch (err) {
    console.error("SEO Inspector error:", err);
  }
})();
