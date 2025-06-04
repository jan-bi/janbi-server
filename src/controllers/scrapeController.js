import "dotenv/config.js";
import httpStatusCode from "../utils/httpStatusCode.js";
import scrapePage from "../services/pageScraper.js";
import Url from "../models/Url.js";
import ChangeLog from "../models/ChangeLog.js";

export const scrapeUrlById = async (req, res) => {
  const { id } = req.params;

  try {
    const savedUrl = await Url.findById(id);

    if (!savedUrl) {
      return res.status(httpStatusCode.NOT_FOUND).json({ message: "해당 ID의 URL을 찾을 수 없습니다." });
    }

    if (!savedUrl.userId.equals(req.user._id)) {
      return res.status(httpStatusCode.UNAUTHORIZED).json({ message: "권한이 없습니다." });
    }


    const scrapeResult = await scrapePage(savedUrl.url, savedUrl.selectors);

    if (scrapeResult.success) {
      savedUrl.previousHtml = scrapeResult.data.fullHtml;
      await savedUrl.save();

      await ChangeLog.create({
        urlId: savedUrl._id,
        scheduledTime: new Date(),
        isChanged: true,
        changedSelectors: [],
        changedContents: scrapeResult.data,
        alreadyNotified: false,
      });

      return res.status(httpStatusCode.OK).json(scrapeResult);
    } else {
      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json(scrapeResult);
    }
  } catch (err) {
    console.error("스크래핑 중 오류 발생:", err);
    return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "서버 오류가 발생했습니다." });
  }
};
