import httpStatusCode from "../utils/httpStatusCode.js";
import UrlModel from "../models/Url.js";
import ChangeLog from "../models/ChangeLog.js";

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
      return res
        .status(httpStatusCode.BAD_REQUEST)
        .json({ message: "선택된 요소가 없습니다." });
    }

    const newUrl = await UrlModel.create({
      userId: req.user._id,
      url: trimmedUrl,
      name: trimmedName,
      dayOfWeek,
      scheduleTime,
      selectors: selectors.map(({ type, selector }) => ({ type, selector })),
    });

    const initialSnapshots = selectors.map(({ type, selector, content }) => ({
      selector: `${type}:${selector}`,
      beforeHtml: "",
      afterHtml: content || "<비어있음>",
    }));

    await ChangeLog.create({
      urlId: newUrl._id,
      scheduledTime: new Date(),
      isChanged: false,
      changedSelectors: [],
      changedContents: initialSnapshots,
      alreadyNotified: true,
    });

    return res
      .status(httpStatusCode.CREATED)
      .json({ message: "URL이 성공적으로 등록되었습니다.", data: newUrl });
  } catch (error) {
    console.error("URL 추가에 실패했습니다.", error);
    return res
      .status(httpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: "서버 오류가 발생했습니다." });
  }
};

export const getUrlHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const url = await UrlModel.findById(id);

    if (!url || !url.userId.equals(req.user._id)) {
      return res.status(httpStatusCode.UNAUTHORIZED).json({ message: "접근 권한이 없습니다." });
    }

    const urlHistoryLogs = await ChangeLog.find({ urlId: id }).sort({ scheduleTime: -1 });

    return res.status(httpStatusCode.OK).json({ url: await UrlModel.findById(id), urlHistoryLogs });
  } catch (err) {
    console.error("변경 이력 조회에 실패했습니다.", err);
    return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "서버 오류가 발생했습니다." });
  }
};

export const getAllUrls = async (req, res) => {
  try {
    const urlList = await UrlModel.find({ userId: req.user._id }).sort({ createdAt: -1 });

    return res.status(httpStatusCode.OK).json({ urlList });
  } catch (err) {
    console.error("URL 목록 조회에 실패했습니다.", err);
    return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "서버 오류가 발생했습니다." });
  }
};

export const getUrlHistoryLogs = async (req, res) => {
  const { id: urlId } = req.params;
  const { cursor, limit = 10 } = req.query;

  const query = { urlId };

  if (cursor) {
    query._id = { $lt: cursor };
  }

  try {
    const url = await UrlModel.findById(urlId);

    if (!url || !url.userId.equals(req.user._id)) {
      return res
        .status(httpStatusCode.UNAUTHORIZED)
        .json({ message: "접근 권한이 없습니다." });
    }

    const logs = await ChangeLog.find(query)
      .sort({ _id: -1 })
      .limit(Number(limit));

    const nextCursor = logs.length > 0 ? logs[logs.length - 1]._id : null;

    return res
      .status(httpStatusCode.OK)
      .json({ urlHistoryLogs: logs, nextCursor });
  } catch (err) {
    console.error("히스토리 불러오기에 실패했습니다.", err);
    return res
      .status(httpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: "히스토리 조회에 실패했습니다." });
  }
};
