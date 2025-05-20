import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import httpStatusCode from "../utils/httpStatusCode.js";
import { cookieOptions } from "../utils/cookieOptions.js";

const router = express.Router();

router.get("/profile", authenticate, (req, res) => {
  res.json({ user: req.user });
});

router.post("/logout", (req, res) => {
  res.clearCookie("accessToken", {
    ...cookieOptions,
  });
  res.clearCookie("refreshToken", {
    ...cookieOptions,
  });
  res.status(httpStatusCode.OK).json({ message: "로그아웃 완료" });
});

export default router;
