import scrapePage from "./pageScraper.js";

export default async function detectChanges(savedUrl, previousValues = {}) {
  const { url, selectors } = savedUrl;
  const scrapeResult = await scrapePage(url, selectors);

  if (!scrapeResult.success) {
    return {
      isChanged: false,
      changedSelectors: [],
      changedContents: [],
    };
  }

  const changedSelectors = [];
  const changedContents = [];

  for (const { selector, value: after } of scrapeResult.data) {
    const before = previousValues[selector] || "";

    changedContents.push({ selector, beforeHtml: before, afterHtml: after });

    if (before !== after) {
      changedSelectors.push(selector);
    }
  }

  return {
    isChanged: changedSelectors.length > 0,
    changedSelectors,
    changedContents,
  };
}
