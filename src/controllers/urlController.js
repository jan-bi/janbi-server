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

const isValidTimeFormat = (time) => {
  return /^\d{2}:\d{2}$/.test(time);
};

const VALID_DAYS = ["일", "월", "화", "수", "목", "금", "토"];

export const addUrl = async (req, res) => {
  try {
    const { url, name, dayOfWeek, scheduleTime, selectors } = req.body;

    const trimmedUrl = url?.trim();
    const trimmedName = name?.trim();

    if (!trimmedUrl || !trimmedName || !dayOfWeek || !scheduleTime) {
      return res
        .status(httpStatusCode.BAD_REQUEST)
        .json({ message: "필수 값이 누락되었거나 공백이 있습니다." });
    }

    if (!isValidUrl(trimmedUrl)) {
      return res
        .status(httpStatusCode.BAD_REQUEST)
        .json({ message: "유효하지 않은 URL 형식입니다." });
    }

    if (!VALID_DAYS.includes(dayOfWeek)) {
      return res
        .status(httpStatusCode.BAD_REQUEST)
        .json({ message: "유효하지 않은 요일 값입니다." });
    }

    if (!isValidTimeFormat(scheduleTime)) {
      return res
        .status(httpStatusCode.BAD_REQUEST)
        .json({ message: "유효하지 않은 시간 형식입니다." });
    }

    if (!Array.isArray(selectors) || selectors.length === 0) {
      return res.status(httpStatusCode.BAD_REQUEST).json({ message: "선택된 요소가 없습니다." });
    }

    const newUrl = await UrlModel.create({
      url: trimmedUrl,
      name: trimmedName,
      dayOfWeek,
      scheduleTime,
      selectors,
    });

    res
      .status(httpStatusCode.CREATED)
      .json({ message: "URL이 성공적으로 등록되었습니다.", data: newUrl });
  } catch (error) {
    console.error("URL 추가에 실패했습니다.", error);
    res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "서버 오류가 발생했습니다." });
  }
};
