import jwt from "jsonwebtoken";
import User from "../models/User.js";
import httpStatusCode from "../utils/httpStatusCode.js";

export async function authenticate(req, res, next) {
  const token = req.cookies.accessToken;

  if (!token) return res.status(httpStatusCode.UNAUTHORIZED).json({ message: "토큰이 없습니다" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(httpStatusCode.UNAUTHORIZED).json({ message: "사용자를 찾을 수 없습니다." });
    }

    req.user = user;
    next();
  } catch {
    res.status(httpStatusCode.UNAUTHORIZED).json({ message: "토큰이 유효하지 않습니다" });
  }
}
