import { generateTokens } from "../auth/token.js";
import User from "../models/User.js";

export async function handleGoogleCallback(req, res) {
  const { accessToken, refreshToken } = generateTokens(req.user);
  const isProd = process.env.NODE_ENV === "production";

  await User.findByIdAndUpdate(req.user._id, { refreshToken });

  res
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "None" : "Lax",
      maxAge: 60 * 60 * 1000,
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .redirect(`${process.env.CLIENT_ORIGIN}/auth/success`);
}
