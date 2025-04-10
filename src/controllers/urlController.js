import httpStatusCode from "../utils/httpStatusCode.js";
import UrlModel from "../models/Url.js";

const isValidUrl = (value) => {
  try {
    new URL(value);

    return true;
  } catch {
    return false;
  }
};

export const addUrl = async (req, res) => {
  try {
    const { url, name, checkInterval } = req.body;

    const trimmedUrl = url?.trim();
    const trimmedName = name?.trim();

    if (!trimmedUrl || !trimmedName || !checkInterval) {
      return res
        .status(httpStatusCode.BAD_REQUEST)
        .json({ message: "필수 값이 누락되었거나 공백이 있습니다." });
    }

    if (!isValidUrl(trimmedUrl)) {
      return res
        .status(httpStatusCode.BAD_REQUEST)
        .json({ message: "유효하지 않은 URL 형식입니다." });
    }

    const newUrl = await UrlModel.create({
      url: trimmedUrl,
      name: trimmedName,
      checkInterval,
    });

    res
      .status(httpStatusCode.CREATED)
      .json({ message: "URL이 성공적으로 등록되었습니다.", data: newUrl });
  } catch (error) {
    console.error("URL 추가에 실패했습니다.", error);
    res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "서버 오류가 발생했습니다." });
  }
};
