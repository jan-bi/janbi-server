import "dotenv/config.js";
import httpStatusCode from "../utils/httpStatusCode.js";
import { scrapeStaticPage } from "../services/staticScraper.js";

export const getStaticHtml = async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(httpStatusCode.BAD_REQUEST).json({ message: "분석할 URL이 없습니다." });
  }

  const scrapeResult = await scrapeStaticPage(url);

  if (scrapeResult.success) {
    return res.status(httpStatusCode.OK).json(scrapeResult);
  } else {
    return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json(scrapeResult);
  }
};
