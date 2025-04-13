import puppeteer from "puppeteer"

export default async function scrapePage(url) {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: "networkidle2" });
    await page.waitForSelector("body", { timeout: 10000 });

    const fullHtml = await page.content();
    await browser.close();

    return {
      success: true,
      data: { fullHtml },
    };
  } catch (err) {
    console.error("페이지 스크래핑 실패", err.message);

    return { success: false, error: "페이지 스크래핑 실패" };
  }
}
