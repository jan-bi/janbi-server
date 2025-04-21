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

  const changedSelectors = [];
  const changedContents = [];

  for (const selector of selectors) {
    const currentElement = selector.type === "css"
      ? currentDom.querySelector(selector.selector)
      : currentDom.evaluate(selector.selector, currentDom, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

      const previousElement = selector.type === "css"
      ? previousDom.querySelector(selector.selector)
      : previousDom.evaluate(selector.selector, previousDom, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

    const afterHtml = currentElement?.outerHTML || "";
    const beforeHtml = previousElement?.outerHTML || "";

    if (afterHtml !== beforeHtml) {
      changedSelectors.push(`${selector.type}:${selector.selector}`);
      changedContents.push({
        selector: `${selector.type}:${selector.selector}`,
        beforeHtml,
        afterHtml,
      });
    }
  }

  return { isChanged: changedSelectors.length > 0 ? true : false, changedSelectors, changedContents };
}
