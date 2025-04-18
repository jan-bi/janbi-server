import { JSDOM } from "jsdom";
import scrapePage from "./pageScraper";

export default async function detectChanges(savedUrl) {
  const { url, previousHtml, selectors } = savedUrl;
  const scrapeResult = await scrapePage(url);

  if (!scrapeResult.success) {
    return { isChanged: false, changedSelectors: null };
  }

  const currentDom = new JSDOM(scrapeResult.data.fullHtml).window.document;
  const previousDom = new JSDOM(previousHtml || "");
  const previousDocument = previousDom.window.document;

  const changedSelectors = [];

  for (const selector of selectors) {
    const currentElement = currentDom.querySelector(selector);
    const currentContent = currentElement.outerHTML || "";

    const previousElement = previousDocument.querySelector(selector);
    const previousContent = previousElement.outerHTML || "";

    if (currentContent !== previousContent) {
      changedSelectors.push(selector);
    }
  }

  return { isChanged: changedSelectors.length > 0 ? true : false, changedSelectors };
}
