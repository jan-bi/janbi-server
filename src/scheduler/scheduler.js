import cron from "node-cron";
import Url from "../models/Url.js";
import detectChanges from "../services/changeDetector.js";
import ChangeLog from "../models/ChangeLog.js";

const DAY = {
  "일": 0,
  "월": 1,
  "화": 2,
  "수": 3,
  "목": 4,
  "금": 5,
  "토": 6,
};

const urlCronJobMap = new Map();

export function createSchedule(urlInfo) {
  const urlId = urlInfo._id.toString();

  if (!urlInfo.scheduleTime || !urlInfo.dayOfWeek) {
    console.log("설정된 스케줄이 없습니다.");

    return;
  }

  if (urlCronJobMap.has(urlId)) {
    console.log(`이미 등록된 스케줄입니다. (${urlInfo.name})`);

    return;
  }

  const { dayOfWeek, scheduleTime } = urlInfo;
  const [hour, minute] = scheduleTime.split(":");
  const dayIndex = DAY[dayOfWeek];

  const cronExpression = `${minute} ${hour} * * ${dayIndex}`;

  const cronJob = cron.schedule(cronExpression, async () => {
    try {
      const changeResult = await detectChanges(urlInfo);

      await ChangeLog.create({
        urlId: urlInfo._id,
        scheduledTime: new Date(),
        isChanged: changeResult.isChanged,
        changedSelectors: changeResult.changedSelectors,
        changedContents: changeResult.changedContents,
        alreadyNotified: false,
      });

      if (changeResult.isChanged) {
        console.log("변경 감지", changeResult.changedSelectors);
      } else {
        console.log("변경된 것이 없습니다.");
      }
    } catch (err) {
      console.error("스케줄 등록에 실패하였습니다.", err);
    }
  });

  urlCronJobMap.set(urlId, cronJob);
  console.log(`스케줄 등록 완료 ${urlInfo.name} (${dayOfWeek} ${scheduleTime})`);
}

export async function initializeSchedule() {
  try {
    const urlList = await Url.find({});

    urlList.forEach(createSchedule);
    console.log(`전체 URL에 대한 스케줄 등록 완료 (총 ${urlList.length}개)`);
  } catch (err) {
    console.error("서버 시작 전 스케줄 등록 실패", err);
  }
}
