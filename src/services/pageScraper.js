const SCRAPER_URL = process.env.SCRAPER_URL;

export default async function scrapePage(url, selectors = []) {
  try {
    const scraperResponse = await fetch(SCRAPER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, selectors }),
    });
    const scrapeResult = await scraperResponse.json();

    if (!scraperResponse.ok || !scrapeResult.success) {
      return { success: false, data: [] };
    }

    return scrapeResult;
  } catch (err) {
    console.error("스크래퍼 요청 실패:", err);
    return { success: false, data: [] };
  }
}
