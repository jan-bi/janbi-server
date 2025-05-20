import { generateTokens } from "../auth/token.js";
import User from "../models/User.js";
import { cookieOptions } from "../utils/cookieOptions.js";

export async function handleGoogleCallback(req, res) {
  const { accessToken, refreshToken } = generateTokens(req.user);

  await User.findByIdAndUpdate(req.user._id, { refreshToken });

  res
    .cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 60 * 60 * 1000,
    })
    .cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .redirect(`${process.env.CLIENT_ORIGIN}/auth/success`);
}
