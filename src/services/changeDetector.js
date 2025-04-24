import { JSDOM } from "jsdom";
import scrapePage from "./pageScraper.js";

export default async function detectChanges(savedUrl) {
  const { url, previousHtml, selectors } = savedUrl;
  const scrapeResult = await scrapePage(url);

  if (!scrapeResult.success) {
    return { isChanged: false, changedSelectors: [], changedContents: [] };
  }

  const currentDom = new JSDOM(scrapeResult.data.fullHtml).window.document;
  const previousDom = new JSDOM(previousHtml || "").window.document;
  const XPathResult = currentDom.defaultView.XPathResult;

  const changedSelectors = [];
  const changedContents = [];

  for (const selector of selectors) {
    let currentElement, previousElement;

    try {
      currentElement = selector.type === "css"
        ? currentDom.querySelector(selector.selector)
        : currentDom.evaluate(
            selector.selector,
            currentDom,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
          ).singleNodeValue;

      previousElement = selector.type === "css"
        ? previousDom.querySelector(selector.selector)
        : previousDom.evaluate(
            selector.selector,
            previousDom,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
          ).singleNodeValue;
    } catch (err) {
      console.warn("XPath 파싱 실패:", selector.selector, err.message);

      continue;
    }

    const getValue = (el) => {
      if (!el) return "<비어있음>";
      if (el.tagName?.toUpperCase() === "IMG") return el.src;

      return el.textContent?.trim() || "<비어있음>";
    };

    const after = getValue(currentElement);
    const before = getValue(previousElement);

    if (before !== after) {
      changedSelectors.push(`${selector.type}:${selector.selector}`);
      changedContents.push({
        selector: `${selector.type}:${selector.selector}`,
        beforeHtml: before,
        afterHtml: after,
      });
    }
  }

  return {
    isChanged: changedSelectors.length > 0,
    changedSelectors,
    changedContents,
  };
}
