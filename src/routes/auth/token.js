import express from "express";
import jwt from "jsonwebtoken";
import User from "../../models/User.js";
import httpStatusCode from "../../utils/httpStatusCode.js";
import { cookieOptions } from "../../utils/cookieOptions.js";

const router = express.Router();

router.post("/refresh", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res
      .status(httpStatusCode.UNAUTHORIZED)
      .json({ message: "Refresh Token이 없습니다." });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res
        .status(httpStatusCode.UNAUTHORIZED)
        .json({ message: "토큰이 유효하지 않습니다." });
    }

    const newAccessToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res
      .cookie("accessToken", newAccessToken, {
        ...cookieOptions,
        maxAge: 60 * 60 * 1000,
      })
      .status(httpStatusCode.OK)
      .json({ message: "Access Token 재발급에 성공했습니다." });

  } catch {
    return res
      .status(httpStatusCode.UNAUTHORIZED)
      .json({ message: "토큰 인증 실패" });
  }
});

export default router;
