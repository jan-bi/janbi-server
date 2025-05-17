import jwt from "jsonwebtoken";

export function generateTokens(user) {
  const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

  return { accessToken, refreshToken };
}
