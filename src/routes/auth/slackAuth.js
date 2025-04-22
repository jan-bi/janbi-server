import express from "express";
import Url from "../../models/Url.js";
import httpStatusCode from "../../utils/httpStatusCode.js";

const router = express.Router();

const CLIENT_ID = process.env.SLACK_CLIENT_ID;
const CLIENT_SECRET = process.env.SLACK_CLIENT_SECRET;
const REDIRECT_URI = process.env.SLACK_REDIRECT_URI;

router.get("/slack/oauth/callback", async (req, res) => {
  const { code, state } = req.query;

  if (!code || !state) {
    return res.status(httpStatusCode.BAD_REQUEST).json({ message: "잘못된 요청입니다." });
  }

  try {
    const response = await fetch("https://slack.com/api/oauth.v2.access", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: new URLSearchParams({
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
      }),
    });

    const result = await response.json();

    if (!result.ok) {
      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Slack 인증에 실패했습니다." });
    }

    const { access_token, incoming_webhook } = result;

    if (!incoming_webhook.channel_id) {
      return res.status(httpStatusCode.BAD_REQUEST).json({ message: "유효하지 않은 채널입니다." });
    }

    await Url.findByIdAndUpdate(state, {
      slack: {
        token: access_token,
        channelId: incoming_webhook.channel_id,
        channelName: incoming_webhook.channel,
        webhookUrl: incoming_webhook.url,
      },
    });

    return res.status(httpStatusCode.OK).json({ message: "Slack 연동이 완료되었습니다." });
  } catch (err) {
    console.error("Slack 연동에 실패했습니다.", err);
    return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Slack 연동 중 오류가 발생했습니다." });
  }
});

export default router;
