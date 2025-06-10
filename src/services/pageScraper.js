import { chromium } from "playwright";

export default async function scrapePage(url, selectors = []) {
  const browser = await chromium.launch({
    headless: true,
  });

  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36",
  });

  const page = await context.newPage();
  await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });

  const selectorValues = [];

  for (const { type, selector } of selectors) {
    let value = "";
    let tagName = "";

    try {
      const locator = type === "xpath"
        ? page.locator(`xpath=${selector}`).first()
        : page.locator(selector).first();

      await locator.waitFor({ state: "attached", timeout: 10000 });

      if (await locator.isVisible()) {
        tagName = await locator.evaluate(el => el.tagName.toUpperCase());

        if (tagName === "IMG") {
          value = await locator.getAttribute("src");
        } else {
          value = (await locator.textContent())?.trim() || "";
        }
      } else {
        console.warn(`${type}:${selector} 찾는 것에 실패했습니다.`);
      }
    } catch (err) {
      console.warn(`스크래핑에 실패했습니다. ${type}:${selector}`, err.message);
    }

    selectorValues.push({
      selector: `${type}:${selector}`,
      value,
      tag: tagName || undefined,
    });
  }

  await browser.close();

  return {
    success: true,
    data: selectorValues,
  };
}
