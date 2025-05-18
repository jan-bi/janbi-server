import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import httpStatusCode from "../utils/httpStatusCode.js";

const router = express.Router();

router.get("/profile", authenticate, (req, res) => {
  res.json({ user: req.user });
});

router.post("/logout", (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });
  res.status(httpStatusCode.OK).json({ message: "로그아웃 완료" });
});

export default router;
