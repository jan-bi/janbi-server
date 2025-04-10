import axios from "axios";
import * as cheerio from "cheerio";

export async function scrapeStaticPage(url) {
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    const fullHtml = $.html();

    return {
      success: true,
      data: {
        html: fullHtml,
      },
    }

  } catch (err) {
    console.error("정적페이지 스크래핑 실패:", err.message);

    return { success: false, error: "정적페이지 스크래핑 실패" };
  }
}
